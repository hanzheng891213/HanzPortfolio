<template>
  <section id="blog" class="blog-section">
    <p ref="tagRef" class="section-tag">/ Blog</p>
    <h2 ref="titleRef" class="section-title">博客</h2>
    <p ref="subtitleRef" class="section-subtitle">记录开发过程中的技术思考与实践总结</p>

    <div v-if="blog.loading" class="blog-section__loading">加载中...</div>

    <div v-else class="blog-section__grid">
      <BlogCard
        v-for="(post, index) in latestPosts"
        :key="post.id"
        :post="post"
        :index="index"
      />
    </div>

    <div class="blog-section__cta-wrap">
      <router-link to="/blog" class="blog-section__cta">
        浏览全部博客
        <FontAwesomeIcon :icon="['fas', 'chevron-right']" class="blog-section__cta-icon" />
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import BlogCard from '@/components/BlogCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const blog = useBlogStore()

const latestPosts = computed(() => blog.sortedPosts.slice(0, 3))

const tagRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

useScrollReveal(tagRef, { delay: 0 })
useScrollReveal(titleRef, { delay: 80 })
useScrollReveal(subtitleRef, { delay: 160 })

onMounted(() => {
  blog.fetchPosts()
})
</script>

<style scoped>
.blog-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 100px;
}

.section-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-dim);
  margin-bottom: 16px;
  text-align: center;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  text-align: center;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  text-align: center;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}

.scroll-revealed {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
}

.blog-section__loading {
  text-align: center;
  color: var(--text-muted);
  font-size: 1.1rem;
  padding: 80px 0;
}

.blog-section__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  height: calc(210px / 0.68 + 140px);
}

.blog-section__grid :deep(.blog-card) {
  height: 100%;
}

.blog-section__grid :deep(.blog-card__inner) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.blog-section__grid :deep(.blog-card__summary) {
  flex: 1;
}

.blog-section__cta-wrap {
  text-align: center;
  margin-top: 32px;
}

.blog-section__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-btn);
  font-size: 14px;
  letter-spacing: 1.5px;
  color: var(--bg-primary);
  background: var(--accent);
  padding: 14px 32px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blog-section__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-glow-strong);
  color: var(--bg-primary);
}

.blog-section__cta-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.blog-section__cta:hover .blog-section__cta-icon {
  transform: translateX(4px);
}

@media (max-width: 900px) {
  .blog-section__grid {
    grid-template-columns: repeat(3, 1fr);
    height: calc(170px / 0.64 + 220px);
  }
}

@media (max-width: 768px) {
  .blog-section {
    padding: 20px 20px 60px;
  }

  .blog-section__grid {
    grid-template-columns: 1fr;
    height: auto;
    gap: 20px;
  }
}
</style>
