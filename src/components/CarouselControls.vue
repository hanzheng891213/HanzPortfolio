<template>
  <div class="carousel-controls" ref="controlsRef">
    <button
      class="carousel-controls__btn"
      @click="$emit('prev')"
      aria-label="上一个作品"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <div class="carousel-controls__dots">
      <button
        v-for="(_, i) in total"
        :key="i"
        class="carousel-controls__dot"
        :class="{ 'carousel-controls__dot--active': i === current }"
        @click="$emit('go-to', i)"
        :aria-label="'第 ' + (i + 1) + ' 个作品'"
      ></button>
    </div>

    <button
      class="carousel-controls__btn"
      @click="$emit('next')"
      aria-label="下一个作品"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  current: number
  total: number
}>()

defineEmits<{
  prev: []
  next: []
  'go-to': [index: number]
}>()

const controlsRef = ref<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    controlsRef.value?.classList.add('carousel-controls--visible')
  }, 600)
})
</script>

<style scoped>
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 120px;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.carousel-controls--visible {
  opacity: 1;
  transform: translateY(0);
}

.carousel-controls__btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--text-primary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.carousel-controls__btn:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 5px var(--accent-glow);
  background: var(--bg-secondary);
  scale: 1.2;
}

.carousel-controls__dots {
  display: flex;
  gap: 100px;
}

@media (max-width: 600px) {
  .carousel-controls__dots {
    gap: 28px;
  }

  .carousel-controls__btn {
    width: 38px;
    height: 38px;
    font-size: 0.95rem;
  }

  .carousel-controls {
    gap: 16px;
    margin-top: 32px;
  }
}

.carousel-controls__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-color);
  transition: background 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  padding: 0;
}

.carousel-controls__dot--active {
  background: var(--accent);
  transform: scale(1.3);
}

.carousel-controls__dot:hover {
  background: var(--accent-dim);
}
</style>
