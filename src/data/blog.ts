import type { BlogPost } from '@/types'

export const seedPosts: BlogPost[] = [
  {
    id: 1,
    title: '使用 Cloudflare Workers 构建轻量 API',
    summary: '介绍如何利用 Cloudflare Workers 和 D1 数据库快速搭建 serverless API，适用于个人项目和小型应用。',
    content: `## 为什么选择 Cloudflare Workers

Cloudflare Workers 是一个 serverless 计算平台，代码运行在 Cloudflare 全球边缘网络上。

### 优势

- **低延迟**：代码在全球 300+ 数据中心运行，离用户最近
- **低成本**：免费额度非常慷慨，每天 10 万请求
- **生态完善**：D1 数据库、R2 存储、KV 存储、Queues 消息队列

### 快速开始

\`\`\`bash
npm create cloudflare@latest my-api
\`\`\`

选择 Worker 模板后，你会得到一个基础项目结构。

### 集成 D1 数据库

\`\`\`sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 部署

\`\`\`bash
npx wrangler deploy
\`\`\`

几分钟后你的 API 就上线了。非常适合个人开发者快速验证想法。`,
    tags: ['Cloudflare', 'Serverless', 'API'],
    cover: '',
    author: 'Han Zheng',
    createdAt: '2026-05-20T08:00:00.000Z',
    updatedAt: '2026-05-20T08:00:00.000Z',
    likeCount: 0,
    viewCount: 0
  },
  {
    id: 2,
    title: 'Vue 3 组合式 API 实战技巧',
    summary: '分享在使用 Vue 3 Composition API 开发过程中的一些实用模式和常见陷阱。',
    content: `## Composables：逻辑复用的最佳方式

Vue 3 的 Composition API 让逻辑复用变得非常自然。通过 composables，我们可以把有状态的逻辑抽离出来。

### 基础 Composable 示例

\`\`\`ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
\`\`\`

### 与 Pinia 配合

Composables 适合组件级别的状态，Pinia 适合全局状态。两者可以很好地配合使用。

### 常见陷阱

1. **ref 解包**：在 reactive 对象中 ref 会自动解包，但在数组和 Map 中不会
2. **watch vs watchEffect**：watch 是懒执行的，watchEffect 是立即执行的
3. **生命周期钩子顺序**：setup 中的钩子比 options API 中的先执行`,
    tags: ['Vue', 'TypeScript', '前端'],
    cover: '',
    author: 'Han Zheng',
    createdAt: '2026-05-15T10:30:00.000Z',
    updatedAt: '2026-05-18T14:00:00.000Z',
    likeCount: 0,
    viewCount: 0
  },
  {
    id: 3,
    title: 'RAG-Listing-Copilot 开发回顾',
    summary: '回顾开发 RAG-Listing-Copilot 项目的技术选型、架构设计和总结。',
    content: `## 项目背景

RAG-Listing-Copilot 是一个结合检索增强生成（RAG）技术的智能房产列表助手。

### 技术栈

- **前端**：Vue 3 + TypeScript + Vite
- **后端**：Python FastAPI
- **向量数据库**：ChromaDB
- **LLM**：OpenAI API

### 架构设计

项目采用了分层架构：
- API 层处理 HTTP 请求
- Service 层处理业务逻辑
- Repository 层处理数据持久化
- RAG Pipeline 处理文档检索和生成

### 经验总结

1. 向量检索的准确性很大程度取决于文档切分策略
2. Prompt 工程对输出质量的影响比模型选择更大
3. 需要做好降级方案，LLM 服务可能不稳定`,
    tags: ['RAG', 'AI', '项目总结'],
    cover: '',
    author: 'Han Zheng',
    createdAt: '2026-04-28T16:00:00.000Z',
    updatedAt: '2026-04-28T16:00:00.000Z',
    likeCount: 0,
    viewCount: 0
  }
]
