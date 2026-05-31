<template>
  <div class="admin-page">
    <div class="page-container admin-layout">
      <!-- Sidebar: post list -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar__header">
          <h2 class="admin-sidebar__title">文章管理</h2>
          <button class="admin-new-btn" @click="startNewPost">+ 新建</button>
        </div>
        <div v-if="blog.sortedPosts.length === 0" class="admin-empty-list">
          暂无文章
        </div>
        <div v-else class="admin-post-list">
          <div
            v-for="post in blog.sortedPosts"
            :key="post.id"
            class="admin-post-item"
            :class="{ 'admin-post-item--active': editingId === post.id }"
            @click="editPost(post)"
          >
            <div class="admin-post-item__main">
              <span class="admin-post-item__title">{{ post.title }}</span>
              <span class="admin-post-item__date">{{ fmtDate(post.createdAt) }}</span>
            </div>
            <button class="admin-post-item__del" @click.stop="handleDelete(post.id)" title="删除">
              <FontAwesomeIcon :icon="['fas', 'xmark']" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Editor -->
      <main class="admin-editor">
        <template v-if="editingId !== null || isNewPost">
          <div class="admin-editor__field">
            <label class="admin-editor__label">标题</label>
            <input v-model="form.title" class="admin-editor__input" placeholder="文章标题" />
          </div>
          <div class="admin-editor__field">
            <label class="admin-editor__label">摘要</label>
            <textarea v-model="form.summary" class="admin-editor__textarea admin-editor__textarea--sm" placeholder="简短摘要" rows="2" />
          </div>
          <div class="admin-editor__field">
            <label class="admin-editor__label">标签（逗号分隔）</label>
            <input v-model="form.tagsStr" class="admin-editor__input" placeholder="Vue, TypeScript" />
          </div>
          <div class="admin-editor__field">
            <label class="admin-editor__label">正文（Markdown）</label>
            <textarea v-model="form.content" class="admin-editor__textarea" placeholder="Markdown 内容..." rows="16" />
          </div>
          <div class="admin-editor__actions">
            <button class="admin-editor__save" :disabled="saving" @click="handleSave">
              {{ saving ? '保存中...' : '保存' }}
            </button>
            <button class="admin-editor__cancel" @click="cancelEdit">取消</button>
          </div>
        </template>
        <div v-else class="admin-editor__placeholder">
          选择左侧文章进行编辑，或点击「新建」创建新文章
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const blog = useBlogStore()
const auth = useAuthStore()

const editingId = ref<number | null>(null)
const isNewPost = ref(false)
const saving = ref(false)

const form = reactive({
  title: '',
  summary: '',
  tagsStr: '',
  content: ''
})

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN')
}

function startNewPost() {
  editingId.value = null
  isNewPost.value = true
  form.title = ''
  form.summary = ''
  form.tagsStr = ''
  form.content = ''
}

function editPost(post: import('@/types').BlogPost) {
  editingId.value = post.id
  isNewPost.value = false
  form.title = post.title
  form.summary = post.summary
  form.tagsStr = post.tags.join(', ')
  form.content = post.content
}

function cancelEdit() {
  editingId.value = null
  isNewPost.value = false
  form.title = ''
  form.summary = ''
  form.tagsStr = ''
  form.content = ''
}

async function handleSave() {
  if (!form.title || !form.content) return
  saving.value = true
  try {
    const tags = form.tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    if (isNewPost.value) {
      await blog.addPost({
        title: form.title,
        summary: form.summary,
        content: form.content,
        tags,
        cover: '',
        author: auth.user?.email?.split('@')[0] || 'Unknown'
      })
      isNewPost.value = false
    } else if (editingId.value !== null) {
      await blog.editPost(editingId.value, {
        title: form.title,
        summary: form.summary,
        content: form.content,
        tags
      })
    }
    cancelEdit()
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除这篇文章？')) return
  await blog.removePost(id)
  if (editingId.value === id) {
    cancelEdit()
  }
}

onMounted(() => {
  blog.fetchPosts()
})
</script>

<style scoped>
.admin-page {
  position: relative;
  z-index: 1;
}

.admin-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* ── Sidebar ── */
.admin-sidebar {
  width: 300px;
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.admin-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.admin-sidebar__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--text-primary);
}

.admin-new-btn {
  font-family: var(--font-btn);
  font-size: 12px;
  padding: 6px 14px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--accent);
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-new-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.admin-empty-list {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 40px 0;
}

.admin-post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.admin-post-item:hover {
  background: var(--bg-card-hover);
}

.admin-post-item--active {
  background: var(--accent-glow);
  border-left: 3px solid var(--accent);
}

.admin-post-item__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.admin-post-item__title {
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-post-item__date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.admin-post-item__del {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
}

.admin-post-item:hover .admin-post-item__del {
  opacity: 1;
}

.admin-post-item__del:hover {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

/* ── Editor ── */
.admin-editor {
  flex: 1;
  min-width: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 28px;
}

.admin-editor__placeholder {
  color: var(--text-muted);
  text-align: center;
  padding: 80px 0;
  font-size: 1rem;
}

.admin-editor__field {
  margin-bottom: 20px;
}

.admin-editor__label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.admin-editor__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.admin-editor__input:focus {
  border-color: var(--accent);
}

.admin-editor__textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.admin-editor__textarea:focus {
  border-color: var(--accent);
}

.admin-editor__textarea--sm {
  font-family: var(--font-body);
}

.admin-editor__actions {
  display: flex;
  gap: 12px;
}

.admin-editor__save {
  padding: 10px 28px;
  font-family: var(--font-btn);
  font-size: 13px;
  letter-spacing: 1.5px;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.admin-editor__save:hover:not(:disabled) {
  transform: translateY(-2px);
}

.admin-editor__save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin-editor__cancel {
  padding: 10px 20px;
  font-family: var(--font-btn);
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.admin-editor__cancel:hover {
  border-color: var(--text-secondary);
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    max-height: 240px;
  }

  .admin-editor {
    padding: 20px;
  }
}
</style>
