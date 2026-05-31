// Centralized fetch wrapper for API calls

const BASE = '/api'

let tokenGetter = (): string | null => {
  return localStorage.getItem('blog_token')
}

export function setTokenGetter(fn: () => string | null) {
  tokenGetter = fn
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenGetter()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers
  })

  const json = await res.json()

  if (!json.ok) {
    throw new ApiError(json.error || '请求失败', res.status)
  }

  return json.data as T
}
