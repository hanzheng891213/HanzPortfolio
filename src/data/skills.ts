import type { SkillCategory } from '@/types'

export const skills: SkillCategory[] = [
  {
    id: 1,
    category: '前端核心基础',
    icon: ['fas', 'code'],
    description: '熟练掌握 HTML5、CSS3、JavaScript (ES6+) 等前端核心技术与标准，理解相关底层原理。'
  },
  {
    id: 2,
    category: 'TypeScript',
    icon: ['fas', 'cube'],
    description: '熟练使用 TypeScript，具备在 Vue 3 项目中使用 TypeScript 强化类型安全的实战经验。'
  },
  {
    id: 3,
    category: 'Vue 技术生态',
    icon: ['fab', 'vuejs'],
    description: '熟练使用 Vue 3、Vue Router、Pinia 进行项目独立开发，具备模块化与组件化开发能力。'
  },
  {
    id: 4,
    category: 'UI 组件库',
    icon: ['fas', 'palette'],
    description: '熟练使用 ElementUI、Ant 等主流 UI 组件库，并能根据业务需求进行组件二次封装与定制。'
  },
  {
    id: 5,
    category: '前端工程化',
    icon: ['fas', 'gears'],
    description: '熟练使用 Vite、webpack 进行项目构建与优化，Git 进行版本管理，npm/yarn 管理依赖。熟悉 Node.js 基础，能进行前端工具链脚本编写或配合开发环境。'
  },
  {
    id: 6,
    category: '网络与部署',
    icon: ['fas', 'network-wired'],
    description: '理解 HTTP 协议，熟练使用 Axios、Fetch 等进行异步数据请求与接口封装。掌握 Linux 基础命令，能够进行基本的开发环境操作与项目部署。'
  },
  {
    id: 7,
    category: 'AI 辅助开发',
    icon: ['fas', 'robot'],
    description: '具备 AI 辅助开发经验，能利用 Claude Code、Cursor 等工具提升效率，并了解 Prompt 工程、RAG 检索增强、LLM、Harness 等 AI 技术底层原理。'
  }
]
