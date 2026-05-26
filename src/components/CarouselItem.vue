<template>
  <a
    class="carousel-item"
    :href="project.link"
    target="_blank"
    rel="noopener"
    :title="project.title"
  >
    <img
      v-if="project.cover"
      :src="project.cover"
      :alt="project.title"
      class="carousel-item__cover"
    />
    <div v-else class="carousel-item__placeholder"></div>
    <div class="carousel-item__overlay">
      <h3 class="carousel-item__title">{{ project.title }}</h3>
      <span class="carousel-item__tag">View Project</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Project } from '@/types'

defineProps<{
  project: Project
}>()
</script>

<style scoped>
.carousel-item {
  height: 100%;
  width: 100%;
  display: flex;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #164d44;
  border: 1px solid var(--border-color);
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.4s;
  text-decoration: none;
}

.carousel-item:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 32px var(--shadow-color);
  transform: translateY(-4px);
}

/* ── Cover image ── */
.carousel-item__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s;
}

.carousel-item:hover .carousel-item__cover {
  transform: scale(1.05);
}

/* ── Placeholder when no cover ── */
.carousel-item__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 40%, #c8c8c8 100%);
}

/* ── Text overlay ── */
.carousel-item__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 28px;
  background: rgba(23, 23, 23, 0.45);
  transition: background 0.4s;
}

.carousel-item:hover .carousel-item__overlay {
  background: rgba(23, 23, 23, 0.3);
}

.carousel-item__title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.carousel-item__tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
}
</style>
