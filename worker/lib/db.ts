// D1 query helpers
// Bindings are available on the Hono context via c.env.DB

export interface DBUser {
  id: number
  email: string
  password_hash: string
  role: 'admin' | 'visitor'
  created_at: string
}

export interface DBPost {
  id: number
  title: string
  summary: string
  content: string
  tags: string
  cover: string
  author: string
  created_at: string
  updated_at: string
  like_count: number
  view_count: number
}

export function parsePostTags(post: DBPost): string[] {
  try {
    return JSON.parse(post.tags)
  } catch {
    return []
  }
}

export interface PostResponse {
  id: number
  title: string
  summary: string
  content: string
  tags: string[]
  cover: string
  author: string
  createdAt: string
  updatedAt: string
  likeCount: number
  viewCount: number
}

export function toPostResponse(post: DBPost): PostResponse {
  return {
    id: post.id,
    title: post.title,
    summary: post.summary,
    content: post.content,
    tags: parsePostTags(post),
    cover: post.cover,
    author: post.author,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    likeCount: post.like_count,
    viewCount: post.view_count
  }
}
