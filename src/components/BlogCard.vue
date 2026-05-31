<template>
  <article ref="cardRef" class="blog-card" @click="$router.push(`/blog/${post.id}`)">
    <div class="blog-card__inner">
      <div class="blog-card__header">
        <div class="blog-card__tags">
          <span v-for="tag in post.tags" :key="tag" class="blog-card__tag">{{ tag }}</span>
        </div>
        <span class="blog-card__date">{{ formattedDate }}</span>
      </div>
      <h3 class="blog-card__title">{{ post.title }}</h3>
      <p class="blog-card__summary">{{ post.summary }}</p>
      <div class="blog-card__footer">
        <span class="blog-card__stat">
          <FontAwesomeIcon :icon="['fas', 'comment']" />
          {{ post.viewCount }} 阅读
        </span>
        <span class="blog-card__stat">
          <FontAwesomeIcon :icon="['fas', 'heart' as any]" />
          {{ post.likeCount }} 赞
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { BlogPost } from '@/types'

const props = defineProps<{
  post: BlogPost
  index?: number
}>()

const cardRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = cardRef.value
  if (!el || props.index === undefined) return

  el.style.opacity = '0'
  el.style.transform = 'scale(0.88) translateY(30px)'
  el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.transitionDelay = `${props.index * 0.08}s`

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('blog-card--visible')
        } else {
          entry.target.classList.remove('blog-card--visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px 30px 0px' }
  )

  requestAnimationFrame(() => {
    observer.observe(el)
  })
})

const formattedDate = computed(() => {
  const d = new Date(props.post.createdAt)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
})
</script>

<style scoped>
.blog-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.blog-card--visible {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

.blog-card:hover {
  transform: translateY(-4px);
}

.blog-card__inner {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 28px;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.blog-card:hover .blog-card__inner {
  background: var(--bg-card-hover);
  border-color: var(--accent-dim);
  box-shadow: 0 8px 32px var(--accent-glow);
}

.blog-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.blog-card__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.blog-card__tag {
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

.blog-card__date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
  margin-left: 12px;
}

.blog-card__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.blog-card__summary {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__footer {
  display: flex;
  gap: 20px;
}

.blog-card__stat {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .blog-card__inner {
    padding: 20px;
  }

  .blog-card__title {
    font-size: 1.15rem;
  }
}
</style>
