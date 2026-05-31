import type { BlogPost } from '@/types'
import { api } from './api'

// ── Posts ──

export async function getPosts(): Promise<BlogPost[]> {
  return api<BlogPost[]>('/posts')
}

export async function getPostById(id: number): Promise<BlogPost | undefined> {
  try {
    return await api<BlogPost>(`/posts/${id}`)
  } catch {
    return undefined
  }
}

export async function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'viewCount'>): Promise<BlogPost> {
  return api<BlogPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(post)
  })
}

export async function updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
  try {
    return await api<BlogPost>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  } catch {
    return undefined
  }
}

export async function deletePost(id: number): Promise<boolean> {
  try {
    await api(`/posts/${id}`, { method: 'DELETE' })
    return true
  } catch {
    return false
  }
}

export async function resetAllData(): Promise<void> {
  // Resetting data requires deleting all posts individually via admin API.
  // This is intentionally a no-op for the API backend since posts can't be mass-deleted.
  // The admin should delete posts individually through the UI.
}

// ── Views ──

export async function incrementView(postId: number, userEmail?: string): Promise<number> {
  try {
    const data = await api<{ viewCount: number }>(`/posts/${postId}/view`, {
      method: 'POST'
    })
    return data.viewCount
  } catch {
    return 0
  }
}

// ── Likes ──

export async function hasLiked(postId: number, userEmail: string): Promise<boolean> {
  try {
    const data = await api<{ liked: boolean }>(`/posts/${postId}/like`)
    return data.liked
  } catch {
    return false
  }
}

export async function like(postId: number, userEmail: string): Promise<{ liked: boolean; likeCount: number }> {
  return api<{ liked: boolean; likeCount: number }>(`/posts/${postId}/like`, {
    method: 'POST'
  })
}
