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
