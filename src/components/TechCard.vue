<template>
  <div class="tech-card" ref="cardRef">
    <div class="tech-card__accent"></div>
    <i v-if="icon" :class="icon" class="tech-card__icon"></i>
    <h3 class="tech-card__title">{{ category }}</h3>
    <p class="tech-card__desc">{{ description }}</p>
    <div class="tech-card__decoration" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  category: string
  description: string
  icon?: string
  index?: number
}>()

const cardRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = cardRef.value
  if (!el) return

  el.style.opacity = '0'
  el.style.transform = 'scale(0.88) translateY(30px)'
  el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.transitionDelay = `${(props.index ?? 0) * 0.08}s`

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tech-card--visible')
        } else {
          entry.target.classList.remove('tech-card--visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px 30px 0px' }
  )

  requestAnimationFrame(() => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.tech-card {
  position: relative;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 1px;
  padding: 36px 32px;
  overflow: hidden;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}

.tech-card--visible {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

/* Hover: top border sweep */
.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.4s ease, left 0.4s ease;
}

.tech-card:hover::before {
  width: 100%;
  left: 0;
}

.tech-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 32px var(--shadow-color);
  transform: translateY(-4px);
}

.tech-card__icon {
  font-size: 1.6rem;
  color: var(--accent);
  margin-bottom: 14px;
  position: relative;
  z-index: 2;
}

.tech-card__title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 14px;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 2;
}

.tech-card__desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.8;
  position: relative;
  z-index: 2;
}

.tech-card__decoration {
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--accent-dim) 30%,
    var(--accent) 60%,
    var(--accent-bright) 80%,
    transparent 100%
  );
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.tech-card:hover .tech-card__decoration {
  opacity: 1;
}

.tech-card__accent {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tech-card:hover .tech-card__accent {
  opacity: 1;
}

@media (max-width: 600px) {
  .tech-card {
    padding: 28px 24px;
  }
}
</style>
