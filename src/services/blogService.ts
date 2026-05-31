import type { BlogPost } from '@/types'
import { seedPosts } from '@/data/blog'

const POSTS_KEY = 'blog_posts'
const VIEWS_KEY = 'blog_views'
const VIEWED_BY_KEY = 'blog_viewed_by'
const LIKES_KEY = 'blog_likes'

function readPosts(): BlogPost[] {
  const raw = localStorage.getItem(POSTS_KEY)
  if (!raw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts))
    return [...seedPosts]
  }
  try {
    return JSON.parse(raw) as BlogPost[]
  } catch {
    return [...seedPosts]
  }
}

function writePosts(posts: BlogPost[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

function readViews(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}') } catch { return {} }
}

function writeViews(views: Record<number, number>): void {
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views))
}

// Per-user tracking: { [userEmail]: { [postId]: true } }
function readUserMap(key: string): Record<string, Record<number, boolean>> {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

function writeUserMap(key: string, map: Record<string, Record<number, boolean>>): void {
  localStorage.setItem(key, JSON.stringify(map))
}

export function resetAllData(): Promise<void> {
  localStorage.removeItem(POSTS_KEY)
  localStorage.removeItem(VIEWS_KEY)
  localStorage.removeItem(VIEWED_BY_KEY)
  localStorage.removeItem(LIKES_KEY)
  return Promise.resolve()
}

// ── Posts ──

export function getPosts(): Promise<BlogPost[]> {
  const posts = readPosts()
  return Promise.resolve(posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
}

export function getPostById(id: number): Promise<BlogPost | undefined> {
  return Promise.resolve(readPosts().find(p => p.id === id))
}

export function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'viewCount'>): Promise<BlogPost> {
  const posts = readPosts()
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0
  const now = new Date().toISOString()
  const newPost: BlogPost = { ...post, id: maxId + 1, createdAt: now, updatedAt: now, likeCount: 0, viewCount: 0 }
  posts.push(newPost)
  writePosts(posts)
  return Promise.resolve(newPost)
}

export function updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
  const posts = readPosts()
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return Promise.resolve(undefined)
  posts[idx] = { ...posts[idx], ...data, id, updatedAt: new Date().toISOString() }
  writePosts(posts)
  return Promise.resolve(posts[idx])
}

export function deletePost(id: number): Promise<boolean> {
  const posts = readPosts()
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) return Promise.resolve(false)
  writePosts(filtered)
  return Promise.resolve(true)
}

// ── Views (one per logged-in user per post, visitors don't count) ──

export function incrementView(postId: number, userEmail?: string): Promise<number> {
  const views = readViews()
  const current = views[postId] || 0

  // Visitors don't contribute view counts
  if (!userEmail) return Promise.resolve(current)

  const viewedBy = readUserMap(VIEWED_BY_KEY)
  if (!viewedBy[userEmail]) viewedBy[userEmail] = {}
  if (viewedBy[userEmail][postId]) {
    return Promise.resolve(current) // already viewed by this user
  }

  viewedBy[userEmail][postId] = true
  writeUserMap(VIEWED_BY_KEY, viewedBy)

  views[postId] = current + 1
  writeViews(views)

  const posts = readPosts()
  const post = posts.find(p => p.id === postId)
  if (post) {
    post.viewCount = views[postId]
    writePosts(posts)
  }
  return Promise.resolve(views[postId])
}

// ── Likes (one per user per post, no unlike) ──

export function hasLiked(postId: number, userEmail: string): Promise<boolean> {
  const likes = readUserMap(LIKES_KEY)
  return Promise.resolve(!!likes[userEmail]?.[postId])
}

export function like(postId: number, userEmail: string): Promise<{ liked: boolean; likeCount: number }> {
  const likes = readUserMap(LIKES_KEY)
  if (!likes[userEmail]) likes[userEmail] = {}

  if (likes[userEmail][postId]) {
    // Already liked — no-op
    const posts = readPosts()
    const post = posts.find(p => p.id === postId)
    return Promise.resolve({ liked: true, likeCount: post?.likeCount || 0 })
  }

  likes[userEmail][postId] = true
  writeUserMap(LIKES_KEY, likes)

  const posts = readPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return Promise.reject(new Error('Post not found'))

  post.likeCount += 1
  writePosts(posts)
  return Promise.resolve({ liked: true, likeCount: post.likeCount })
}
