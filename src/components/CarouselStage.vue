<template>
  <div class="carousel-wrapper">
    <div class="carousel-stage" ref="stageRef">
      <CarouselContainer
        ref="containerRef"
        :projects="projects"
        :stage-el="stageRef"
      />
    </div>
    <CarouselControls
      :current="currentIndex"
      :total="projects.length"
      @prev="prev"
      @next="next"
      @go-to="goTo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CarouselContainer from './CarouselContainer.vue'
import CarouselControls from './CarouselControls.vue'
import type { Project } from '@/types'
import { TRANSITION_MS, AUTOPLAY_INTERVAL } from '@/constants'
import { throttle } from '@/utils'
import { useAutoplay } from '@/composables/useAutoplay'
import { useTouchSwipe } from '@/composables/useTouchSwipe'

const props = defineProps<{
  projects: Project[]
}>()

const containerRef = ref<InstanceType<typeof CarouselContainer> | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

function updateIndex() {
  currentIndex.value = containerRef.value?.getIndex() ?? 0
}

const next = throttle(() => {
  containerRef.value?.next()
  updateIndex()
}, TRANSITION_MS)

const prev = throttle(() => {
  containerRef.value?.prev()
  updateIndex()
}, TRANSITION_MS)

function goTo(targetIndex: number) {
  containerRef.value?.goTo(targetIndex)
  currentIndex.value = targetIndex
}

const { start, stop } = useAutoplay(next, AUTOPLAY_INTERVAL)

useTouchSwipe(stageRef, next, prev)

onMounted(() => {
  currentIndex.value = containerRef.value?.getIndex() ?? 0
  start()
  stageRef.value?.addEventListener('mouseenter', stop)
  stageRef.value?.addEventListener('mouseleave', start)
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
}

/*
 * 3D 环形轮播不需要 SVG 遮罩，perspective 场景自带空间感。
 * 高度留出倒影 + 3D 透视的余量。
 */
.carousel-stage {
  --post-size: 210px;
  --post-spacing: 240px;
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: calc(var(--post-size) / 0.68 + 260px);
}

/* Tablet */
@media (max-width: 900px) {
  .carousel-stage {
    --post-size: 170px;
    --post-spacing: 240px;
    height: calc(var(--post-size) / 0.64 + 220px);
  }
}

/* Phone */
@media (max-width: 600px) {
  .carousel-stage {
    --post-size: 140px;
    --post-spacing: 180px;
    height: calc(var(--post-size) / 0.6 + 180px);
  }
}
</style>
