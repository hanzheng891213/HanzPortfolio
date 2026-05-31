import type { BlogUser } from '@/types'

const USERS: BlogUser[] = [
  { email: 'hanzheng891213@gmail.com', password: import.meta.env.VITE_ADMIN_PASSWORD, role: 'admin' },
  { email: 'O_O@visitor.com', password: import.meta.env.VITE_VISITOR_PASSWORD, role: 'visitor' }
]

const TOKEN_KEY = 'blog_token'
const USER_KEY = 'blog_user'

function stripPassword(user: BlogUser): BlogUser {
  const { password, ...safe } = user
  return safe
}

export function login(email: string, password: string): Promise<{ token: string; user: BlogUser }> {
  const user = USERS.find(u => u.email === email && u.password === password)
  if (!user) {
    return Promise.reject(new Error('邮箱或密码错误'))
  }
  const token = btoa(`${user.email}:${Date.now()}`)
  const safeUser = stripPassword(user)
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  return Promise.resolve({ token, user: safeUser })
}

export function logout(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  return Promise.resolve()
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
