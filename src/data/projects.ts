import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 1,
    title: '电商管理后台',
    description: '基于 Vue 3 + Element Plus 的后台管理系统，包含商品管理、订单处理、数据统计等功能',
    cover: '/project-admin.svg',
    link: 'https://github.com/hanzheng891213'
  },
  {
    id: 2,
    title: '移动端社区应用',
    description: '基于 Vue 3 + Vant UI 的移动端社区，支持发帖、评论、点赞、关注等功能',
    cover: '/project-mobile.svg',
    link: 'https://github.com/hanzheng891213'
  },
  {
    id: 3,
    title: '个人博客系统',
    description: '基于 Vue 3 + Markdown 的个人博客，支持文章发布、标签分类、搜索功能',
    cover: '/project-blog.svg',
    link: 'https://github.com/hanzheng891213'
  },
]
