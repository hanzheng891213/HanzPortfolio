-- HanzPortfolio Seed Data
-- Run: npx wrangler d1 execute hanz-portfolio-db --file=db/seed.sql

INSERT OR IGNORE INTO users (email, password_hash, role) VALUES
  ('hanzheng891213@gmail.com', '9368165decc3c64f00af714a652f4ff0:b2f6afa4bf87bafa2e858705ef55a9b77424269558d1c57d43f338bf44037a18', 'admin'),
  ('O_O@visitor.com', 'fc94a5545ef12a60dce2c3ba26bf15b5:282a5ceaf5cd7875588243cbba12c87440b3847d77acf8ef9f0e0f58ac93ea1d', 'visitor');

-- Seed blog posts from the original localStorage seed data
INSERT OR IGNORE INTO blog_posts (id, title, summary, content, tags, cover, author, created_at, updated_at, like_count, view_count) VALUES
  (1,
   'Cloudflare Workers 入门指南',
   '了解如何用 Cloudflare Workers 构建边缘计算应用，从零搭建你的第一个 Worker。',
   '# Cloudflare Workers 入门指南\n\nCloudflare Workers 是一个**边缘计算**平台，可以在全球 300+ 数据中心运行代码。\n\n## 为什么选择 Workers？\n\n- **低延迟** — 代码运行在离用户最近的数据中心\n- **无服务器** — 不需要管理服务器\n- **免费额度** — 每天 10 万次请求免费\n\n## 快速开始\n\n```bash\nnpm create cloudflare@latest\n```\n\n```typescript\nexport default {\n  async fetch(request: Request): Promise<Response> {\n    return new Response(''Hello from Workers!'')\n  }\n}\n```\n\n## 常见场景\n\n1. API 网关\n2. A/B 测试\n3. 边缘渲染\n4. 请求修改/重定向\n\n更多内容请查阅 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)。',
   '["Cloudflare","Workers","边缘计算"]',
   '',
   'hanzheng891213@gmail.com',
   '2025-01-15T08:00:00.000Z',
   '2025-01-15T08:00:00.000Z',
   3, 12),
  (2,
   'Vue 3 Composition API 实战',
   '深入理解 Vue 3 Composition API，通过实际案例掌握 ref、reactive、computed 和 watch。',
   '# Vue 3 Composition API 实战\n\nComposition API 是 Vue 3 最重要的新特性之一。\n\n## setup 函数\n\n```typescript\nimport { ref, computed } from ''vue''\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    return { count, doubled }\n  }\n}\n```\n\n## 响应式基础\n\n### ref vs reactive\n\n- `ref` — 适用于基本类型\n- `reactive` — 适用于对象\n\n### computed\n\n计算属性会自动追踪依赖并缓存结果。\n\n### watch\n\n```typescript\nwatch(count, (newVal, oldVal) => {\n  console.log(`count 从 ${oldVal} 变为 ${newVal}`)\n})\n```\n\n## 组合式函数\n\n把逻辑抽取到可复用的组合式函数中：\n\n```typescript\nfunction useCounter() {\n  const count = ref(0)\n  const increment = () => count.value++\n  return { count, increment }\n}\n```',
   '["Vue","JavaScript","前端"]',
   '',
   'hanzheng891213@gmail.com',
   '2025-02-20T10:30:00.000Z',
   '2025-02-20T10:30:00.000Z',
   7, 28),
  (3,
   'RAG Listing Copilot 开发回顾',
   '一个基于 RAG 架构的智能房产问答助手的技术总结与复盘。',
   '# RAG Listing Copilot 开发回顾\n\n## 项目背景\n\nRAG（Retrieval-Augmented Generation）是当前最流行的 LLM 应用架构之一。Listing Copilot 是一个**智能房产问答助手**，能够根据房源数据库回答用户的问题。\n\n## 架构设计\n\n### 技术栈\n\n- **前端** — Next.js + TypeScript\n- **后端** — Python FastAPI\n- **向量数据库** — Pinecone\n- **LLM** — GPT-4o\n\n### 核心流程\n\n1. 用户提问\n2. Embedding 模型将问题向量化\n3. 在 Pinecone 中检索相关房源\n4. 将检索结果拼接为 context\n5. GPT-4o 基于 context 生成回答\n\n## 技术难点\n\n### 检索质量\n\n- 优化 chunk size 和 overlap\n- 混合检索（关键词 + 向量）\n\n### 延迟优化\n\n- Streaming 响应\n- Embedding 缓存\n\n## 总结\n\nRAG 架构在特定领域问答场景下表现优秀，但需要对检索 pipeline 进行细致的调优。',
   '["AI","RAG","全栈","LLM"]',
   '',
   'hanzheng891213@gmail.com',
   '2025-03-10T14:00:00.000Z',
   '2025-03-10T14:00:00.000Z',
   5, 19);
