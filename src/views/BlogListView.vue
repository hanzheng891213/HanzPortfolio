<template>
  <div class="blog-list-page">
    <div class="page-container">
      <div class="blog-list-header">
        <div>
          <p class="section-tag">/ Blog</p>
          <h1 class="section-title">博客</h1>
          <p class="section-subtitle">记录技术思考与实践总结</p>
        </div>
        <router-link v-if="auth.isAdmin" to="/blog/admin" class="publish-btn">
          <FontAwesomeIcon :icon="['fas', 'pen-to-square']" />
          发布文章
        </router-link>
      </div>

      <div v-if="blog.loading" class="blog-list-empty">加载中...</div>

      <div v-else-if="blog.sortedPosts.length === 0" class="blog-list-empty">
        暂无文章
      </div>

      <div v-else class="blog-list-grid">
        <BlogCard
          v-for="post in blog.sortedPosts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
import BlogCard from '@/components/BlogCard.vue'

const blog = useBlogStore()
const auth = useAuthStore()

onMounted(() => {
  blog.fetchPosts()
})
</script>

<style scoped>
.blog-list-page {
  position: relative;
  z-index: 1;
}

.blog-list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.blog-list-header .section-subtitle {
  margin-bottom: 0;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 12px 24px;
  font-family: var(--font-btn);
  font-size: 13px;
  letter-spacing: 1.5px;
  color: var(--bg-primary);
  background: var(--accent);
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.publish-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-glow-strong);
  color: var(--bg-primary);
}

.blog-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
  margin-top: 32px;
}

.blog-list-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 1.1rem;
  padding: 80px 0;
}

@media (max-width: 768px) {
  .blog-list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .publish-btn {
    justify-content: center;
  }

  .blog-list-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
