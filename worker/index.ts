import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { signJWT, verifyJWT, verifyPassword } from './lib/auth'
import { toPostResponse } from './lib/db'
import type { DBUser, DBPost } from './lib/db'

// Extend Hono's Env to include our bindings
type Env = {
  DB: D1Database
  JWT_SECRET: string
  ASSETS: Fetcher
}

type Variables = {
  user: { id: number; email: string; role: 'admin' | 'visitor' }
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use('/api/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// ── Auth middleware ──
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ ok: false, error: '未登录' }, 401)
  }
  const token = authHeader.slice(7)
  const payload = await verifyJWT(token, c.env.JWT_SECRET)
  if (!payload) {
    return c.json({ ok: false, error: '登录已过期，请重新登录' }, 401)
  }
  c.set('user', { id: payload.sub as number, email: payload.email as string, role: payload.role as 'admin' | 'visitor' })
  await next()
}

async function adminMiddleware(c: any, next: any) {
  const user = c.get('user')
  if (user.role !== 'admin') {
    return c.json({ ok: false, error: '需要管理员权限' }, 403)
  }
  await next()
}

// ── Auth routes ──
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()
  if (!email || !password) {
    return c.json({ ok: false, error: '请输入邮箱和密码' }, 400)
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<DBUser>()
  if (!user) {
    return c.json({ ok: false, error: '邮箱或密码错误' }, 401)
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return c.json({ ok: false, error: '邮箱或密码错误' }, 401)
  }

  const token = await signJWT({ sub: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET)

  return c.json({
    ok: true,
    data: {
      token,
      user: { email: user.email, role: user.role }
    }
  })
})

app.get('/api/auth/me', authMiddleware, (c) => {
  const user = c.get('user')
  return c.json({
    ok: true,
    data: { email: user.email, role: user.role }
  })
})

// ── Post routes ──

// List all posts
app.get('/api/posts', async (c) => {
  const posts = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all<DBPost>()
  return c.json({
    ok: true,
    data: posts.results.map(toPostResponse)
  })
})

// Get single post
app.get('/api/posts/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first<DBPost>()
  if (!post) return c.json({ ok: false, error: '文章不存在' }, 404)

  return c.json({ ok: true, data: toPostResponse(post) })
})

// Create post (admin only)
app.post('/api/posts', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json<{ title: string; summary: string; content: string; tags: string[]; cover: string }>()
  if (!body.title) return c.json({ ok: false, error: '标题不能为空' }, 400)

  const user = c.get('user')
  const now = new Date().toISOString()
  const tags = JSON.stringify(body.tags || [])
  const summary = body.summary || ''
  const content = body.content || ''
  const cover = body.cover || ''

  const result = await c.env.DB.prepare(
    'INSERT INTO blog_posts (title, summary, content, tags, cover, author, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.title, summary, content, tags, cover, user.email, now, now).run()

  if (!result.success) return c.json({ ok: false, error: '创建失败' }, 500)

  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(result.meta.last_row_id).first<DBPost>()
  return c.json({ ok: true, data: toPostResponse(post!) }, 201)
})

// Update post (admin only)
app.put('/api/posts/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const existing = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first<DBPost>()
  if (!existing) return c.json({ ok: false, error: '文章不存在' }, 404)

  const body = await c.req.json<{ title?: string; summary?: string; content?: string; tags?: string[]; cover?: string }>()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'UPDATE blog_posts SET title = ?, summary = ?, content = ?, tags = ?, cover = ?, updated_at = ? WHERE id = ?'
  ).bind(
    body.title ?? existing.title,
    body.summary ?? existing.summary,
    body.content ?? existing.content,
    body.tags ? JSON.stringify(body.tags) : existing.tags,
    body.cover ?? existing.cover,
    now,
    id
  ).run()

  const updated = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first<DBPost>()
  return c.json({ ok: true, data: toPostResponse(updated!) })
})

// Delete post (admin only)
app.delete('/api/posts/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const existing = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first<DBPost>()
  if (!existing) return c.json({ ok: false, error: '文章不存在' }, 404)

  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run()
  return c.json({ ok: true, data: null })
})

// Check if user has liked a post
app.get('/api/posts/:id/like', authMiddleware, async (c) => {
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const user = c.get('user')
  const existing = await c.env.DB.prepare(
    'SELECT id FROM blog_likes WHERE post_id = ? AND user_email = ?'
  ).bind(postId, user.email).first()

  return c.json({ ok: true, data: { liked: !!existing } })
})

// Like a post (authenticated users only)
app.post('/api/posts/:id/like', authMiddleware, async (c) => {
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const user = c.get('user')
  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(postId).first<DBPost>()
  if (!post) return c.json({ ok: false, error: '文章不存在' }, 404)

  // Check if already liked
  const existing = await c.env.DB.prepare(
    'SELECT id FROM blog_likes WHERE post_id = ? AND user_email = ?'
  ).bind(postId, user.email).first()

  if (existing) {
    return c.json({ ok: true, data: { liked: true, likeCount: post.like_count } })
  }

  await c.env.DB.prepare(
    'INSERT INTO blog_likes (post_id, user_email) VALUES (?, ?)'
  ).bind(postId, user.email).run()

  await c.env.DB.prepare(
    'UPDATE blog_posts SET like_count = like_count + 1 WHERE id = ?'
  ).bind(postId).run()

  return c.json({ ok: true, data: { liked: true, likeCount: post.like_count + 1 } })
})

// Record a view
app.post('/api/posts/:id/view', async (c) => {
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) return c.json({ ok: false, error: '无效的文章 ID' }, 400)

  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(postId).first<DBPost>()
  if (!post) return c.json({ ok: false, error: '文章不存在' }, 404)

  // Try to get user from auth header (optional for views)
  let userEmail: string | null = null
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const payload = await verifyJWT(authHeader.slice(7), c.env.JWT_SECRET)
    if (payload) userEmail = payload.email as string
  }

  if (userEmail) {
    const existing = await c.env.DB.prepare(
      'SELECT id FROM blog_views WHERE post_id = ? AND user_email = ?'
    ).bind(postId, userEmail).first()

    if (!existing) {
      await c.env.DB.prepare(
        'INSERT INTO blog_views (post_id, user_email) VALUES (?, ?)'
      ).bind(postId, userEmail).run()

      await c.env.DB.prepare(
        'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?'
      ).bind(postId).run()
    }
  }

  const updated = await c.env.DB.prepare('SELECT view_count FROM blog_posts WHERE id = ?').bind(postId).first<{ view_count: number }>()
  return c.json({ ok: true, data: { viewCount: updated?.view_count ?? post.view_count } })
})

// ── Default export for Cloudflare Worker ──
// /api/* requests go to Hono; everything else is served as static assets
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api')) {
      return app.fetch(request, env)
    }
    // Serve static assets (SPA fallback handled by [assets] config)
    // In local dev without assets, return a simple 404
    if (env.ASSETS) {
      return env.ASSETS.fetch(request)
    }
    return new Response('Not found (local dev — use Vite for frontend)', { status: 404 })
  }
}
