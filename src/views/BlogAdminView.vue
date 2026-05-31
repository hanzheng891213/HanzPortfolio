<template>
  <div class="admin-page">
    <!-- Mobile top bar -->
    <div class="admin-mobile-bar">
      <button class="admin-mobile-bar__btn" @click="showSidebar = !showSidebar">
        <FontAwesomeIcon :icon="['fas', showSidebar ? 'xmark' : 'bars']" />
      </button>
      <span class="admin-mobile-bar__title">
        {{ editingId !== null || isNewPost ? (isNewPost ? '新建文章' : '编辑文章') : '文章管理' }}
      </span>
      <button
        v-if="editingId !== null || isNewPost"
        class="admin-mobile-bar__btn"
        @click="cancelEdit"
      >
        <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
      </button>
      <span v-else style="width:36px"></span>
    </div>

    <div class="page-container admin-layout">
      <!-- Sidebar: post list -->
      <aside class="admin-sidebar" :class="{ 'admin-sidebar--open': showSidebar }">
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
            @click="selectPost(post)"
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
      <main class="admin-editor" :class="{ 'admin-editor--hidden-mobile': !(editingId !== null || isNewPost) && showSidebar }">
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
const showSidebar = ref(true)

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
  showSidebar.value = false
  form.title = ''
  form.summary = ''
  form.tagsStr = ''
  form.content = ''
}

function selectPost(post: import('@/types').BlogPost) {
  editingId.value = post.id
  isNewPost.value = false
  showSidebar.value = false
  form.title = post.title
  form.summary = post.summary
  form.tagsStr = post.tags.join(', ')
  form.content = post.content
}

function cancelEdit() {
  editingId.value = null
  isNewPost.value = false
  showSidebar.value = true
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

/* ── Mobile top bar ── */
.admin-mobile-bar {
  display: none;
  position: sticky;
  top: 80px;
  z-index: 30;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  margin: -40px -20px 20px;
}

.admin-mobile-bar__btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.admin-mobile-bar__btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.admin-mobile-bar__title {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--text-primary);
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
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.admin-new-btn {
  font-family: var(--font-btn);
  font-size: 11px;
  letter-spacing: 0.5px;
  padding: 6px 14px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--accent);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-new-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.admin-empty-list {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
  padding: 40px 0;
}

.admin-post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
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
  font-size: 0.88rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-post-item__date {
  font-size: 0.72rem;
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
  transition: all 0.2s ease;
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
  font-size: 0.95rem;
}

.admin-editor__field {
  margin-bottom: 18px;
}

.admin-editor__label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.admin-editor__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s ease;
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
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;
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
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.admin-editor__save:hover:not(:disabled) {
  transform: translateY(-1px);
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
  transition: border-color 0.2s ease;
}

.admin-editor__cancel:hover {
  border-color: var(--text-secondary);
}

@media (max-width: 768px) {
  .admin-mobile-bar {
    display: flex;
  }

  .admin-layout {
    flex-direction: column;
    gap: 0;
  }

  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    max-height: none;
    z-index: 20;
    border-radius: 0;
    border: none;
    padding: 0 16px 16px;
    padding-top: 130px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-editor--hidden-mobile {
    display: none;
  }

  .admin-editor {
    border-radius: 0;
    border: none;
    background: transparent;
    padding: 4px 0 40px;
  }

  .admin-editor__placeholder {
    padding: 60px 20px;
    font-size: 0.9rem;
  }

  .admin-editor__field {
    margin-bottom: 14px;
  }

  .admin-editor__input,
  .admin-editor__textarea {
    font-size: 16px; /* prevent iOS zoom */
  }

  .admin-editor__textarea {
    min-height: 260px;
  }

  .admin-editor__actions {
    position: sticky;
    bottom: 0;
    background: var(--bg-primary);
    padding: 12px 0;
    margin-top: 8px;
    border-top: 1px solid var(--border-color);
  }

  .admin-editor__save,
  .admin-editor__cancel {
    flex: 1;
    text-align: center;
    padding: 12px;
    font-size: 14px;
  }
}
</style>
