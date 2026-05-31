<template>
  <div class="blog-detail-page">
    <div class="page-container blog-detail-container">
      <router-link to="/blog" class="back-link">
        <i class="fa-solid fa-chevron-left"></i>
        返回博客列表
      </router-link>

      <div v-if="blog.loading" class="blog-detail-empty">加载中...</div>

      <article v-else-if="blog.currentPost" class="blog-article">
        <div class="blog-article__header">
          <div class="blog-article__tags">
            <span v-for="tag in blog.currentPost.tags" :key="tag" class="blog-article__tag">{{ tag }}</span>
          </div>
          <h1 class="blog-article__title">{{ blog.currentPost.title }}</h1>
          <div class="blog-article__meta">
            <span>{{ blog.currentPost.author }}</span>
            <span class="blog-article__dot">|</span>
            <span>{{ formattedDate }}</span>
            <span class="blog-article__dot">|</span>
            <span>{{ blog.currentPost.viewCount }} 阅读</span>
          </div>
        </div>

        <div class="blog-article__content" v-html="renderedContent"></div>

        <div class="blog-article__footer">
          <button
            class="like-btn"
            :class="{ 'like-btn--active': liked }"
            :disabled="liked || liking"
            @click="handleLike"
          >
            <i class="fa-solid fa-heart like-btn__icon"></i>
            <span>{{ blog.currentPost.likeCount }} 赞</span>
          </button>
        </div>
      </article>

      <div v-else class="blog-detail-empty">文章不存在</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
const route = useRoute()
const router = useRouter()
const blog = useBlogStore()
const auth = useAuthStore()

const liked = ref(false)
const liking = ref(false)

const formattedDate = computed(() => {
  if (!blog.currentPost) return ''
  const d = new Date(blog.currentPost.createdAt)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
})

const renderedContent = computed(() => {
  if (!blog.currentPost) return ''
  return blog.currentPost.content
    .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="blog-li">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="blog-li">$2</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="blog-code-block"><code>$2</code></pre>')
    .replace(/\n\n/g, '</p><p class="blog-p">')
    .replace(/^/, '<p class="blog-p">')
    .replace(/$/, '</p>')
})

async function handleLike() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (liked.value || liking.value) return
  liking.value = true
  try {
    await blog.likePost(blog.currentPost!.id, auth.user!.email)
    liked.value = true
  } finally {
    liking.value = false
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  await blog.fetchPostById(id)
  if (blog.currentPost) {
    blog.viewPost(id, auth.user?.email)
    if (auth.isAuthenticated) {
      liked.value = await blog.checkLiked(id, auth.user!.email)
    }
  }
})

watch(() => auth.isAuthenticated, async (val) => {
  if (val && blog.currentPost) {
    liked.value = await blog.checkLiked(blog.currentPost.id, auth.user!.email)
  }
})
</script>

<style scoped>
.blog-detail-page {
  position: relative;
  z-index: 1;
}

.blog-detail-container {
  max-width: 800px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--accent);
}

.blog-detail-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 80px 0;
}

.blog-article__header {
  margin-bottom: 40px;
}

.blog-article__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.blog-article__tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--accent-glow);
  color: var(--accent);
  border: 1px solid var(--accent-dim);
}

.blog-article__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--text-primary);
  line-height: 1.25;
  margin-bottom: 12px;
}

.blog-article__meta {
  font-size: 0.82rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.blog-article__dot {
  font-size: 0.65rem;
  opacity: 0.5;
}

/* ── Content styles ── */
.blog-article__content :deep(.blog-p) {
  font-size: 0.92rem;
  line-height: 1.85;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.blog-article__content :deep(.blog-h2) {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 36px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.blog-article__content :deep(.blog-h3) {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 28px 0 10px;
}

.blog-article__content :deep(.blog-li) {
  margin-bottom: 6px;
  margin-left: 22px;
  color: var(--text-secondary);
  line-height: 1.75;
  font-size: 0.9rem;
}

.blog-article__content :deep(.blog-inline-code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--bg-input);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent);
}

.blog-article__content :deep(.blog-code-block) {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 18px;
  margin: 18px 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-primary);
}

/* ── Like button ── */
.blog-article__footer {
  margin-top: 60px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  border: 1px solid var(--border-color);
  border-radius: 40px;
  font-family: var(--font-btn);
  font-size: 1rem;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover:not(:disabled) {
  border-color: var(--accent-coral);
  color: var(--accent-coral);
}

.like-btn--active {
  background: var(--accent-coral-glow);
  border-color: var(--accent-coral);
  color: var(--color-danger);
}

.like-btn__icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.35;
}

.like-btn--active .like-btn__icon {
  opacity: 1;
}

.like-btn:hover:not(:disabled) .like-btn__icon {
  transform: scale(1.15);
  opacity: 0.7;
}

.like-btn:disabled {
  cursor: default;
}

@media (max-width: 768px) {
  .blog-detail-container {
    padding: 0 16px;
  }

  .blog-article__title {
    font-size: 1.4rem;
  }

  .blog-article__content :deep(.blog-p) {
    font-size: 0.88rem;
    line-height: 1.75;
  }

  .blog-article__content :deep(.blog-h2) {
    font-size: 1.15rem;
  }

  .blog-article__content :deep(.blog-h3) {
    font-size: 1rem;
  }

  .blog-article__content :deep(.blog-code-block) {
    padding: 14px;
    font-size: 0.78rem;
    margin: 14px 0;
  }

  .blog-article__content :deep(.blog-li) {
    font-size: 0.85rem;
  }
}
</style>
