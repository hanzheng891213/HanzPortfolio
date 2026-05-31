export interface Project {
  id: number
  title: string
  description: string
  cover: string
  link: string
}

export interface SkillCategory {
  id: number
  category: string
  icon: [string, string]
  description: string
}

export interface BlogUser {
  email: string
  password?: string
  role: 'admin' | 'visitor'
}

export interface BlogPost {
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

export interface BlogLikeRecord {
  [userEmail: string]: {
    [postId: number]: {
      liked: boolean
      hasContributed: boolean
    }
  }
}
