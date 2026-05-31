import type { BlogUser } from '@/types'
import { api } from './api'

const TOKEN_KEY = 'blog_token'
const USER_KEY = 'blog_user'

export async function login(email: string, password: string): Promise<{ token: string; user: BlogUser }> {
  const data = await api<{ token: string; user: BlogUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data
}

export async function logout(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): BlogUser | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const userStr = localStorage.getItem(USER_KEY)
  if (!token || !userStr) return null
  try {
    return JSON.parse(userStr) as BlogUser
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
