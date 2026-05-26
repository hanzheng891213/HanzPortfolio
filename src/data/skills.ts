import type { SkillCategory } from '@/types'

export const skills: SkillCategory[] = [
  {
    id: 1,
    category: '前端基础',
    icon: ['fas', 'code'],
    description: '熟练掌握 HTML5、CSS3 和 JavaScript（ES6+），能够编写符合语义化、响应式的页面，并实现交互逻辑与动画效果。'
  },
  {
    id: 2,
    category: 'Vue 技术栈',
    icon: ['fab', 'vuejs'],
    description: '熟悉 Vue 3 及其生态，具备 Pinia 状态管理、Vite 构建工具的实际项目经验，能独立开发及维护中大型单页应用。'
  },
  {
    id: 3,
    category: '工程化与工具',
    icon: ['fas', 'gears'],
    description: '了解前端工程化流程，可使用 Vite 配置项目，了解 Node.js 基础，能够配合 CLI 工具进行开发调试。'
  },
  {
    id: 4,
    category: '网络与通信',
    icon: ['fas', 'network-wired'],
    description: '熟悉 HTTP 协议，能使用 Axios 进行前后端数据交互，并对接口封装、错误拦截等有实践经验。'
  },
  {
    id: 5,
    category: '扩展技能',
    icon: ['fas', 'ellipsis'],
    description: '具备 C 语言、Java 基础，了解 Linux 常用命令，可进行基本服务端协作与环境部署；熟悉 Claude Code 等 AI 辅助开发工具，提升开发效率。'
  }
]
