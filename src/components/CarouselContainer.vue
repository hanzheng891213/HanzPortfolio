<template>
  <div class="carousel-3d-scene" :style="sceneStyle">
    <div class="carousel-3d-ring" :style="ringStyle">
      <div
        v-for="(item, i) in items"
        :key="item.id"
        class="carousel-3d-slot"
        :style="getSlotStyle(i)"
      >
        <CarouselItem :project="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CarouselItem from './CarouselItem.vue'
import type { Project } from '@/types'
import { TRANSITION_MS } from '@/constants'
import { fisherYates } from '@/utils'

const props = defineProps<{
  projects: Project[]
  stageEl?: HTMLElement | null
}>()

const items = ref<Project[]>([])
const currentAngle = ref(0)
const canTransition = ref(false)
const postSize = ref(280)
const postSpacing = ref(16)
const stageWidth = ref(0)

let timer: ReturnType<typeof setTimeout> | null = null

const n = computed(() => items.value.length)

/*
 * 角度步长 = 360° / N
 * 第 i 张图在圆环上的位置: rotateY(i * step) translateZ(radius)
 * 容器旋转 rotateY(currentAngle) 切换展示
 */
const step = computed(() => (n.value > 0 ? 360 / n.value : 0))
const perspective = computed(() => Math.max(stageWidth.value * 1.5, 800))

/*
 * 半径公式: R = (w + gap) / (2 * tan(π / N))
 * 把卡片间距纳入计算，圆环更大，卡片之间有间隙 → 立体感更强
 */
const radius = computed(() => {
  if (n.value < 2) return 0
  return (postSize.value + postSpacing.value) / (2 * Math.tan(Math.PI / n.value))
})

function updateDimensions() {
  const stage = props.stageEl || document.querySelector('.carousel-stage') as HTMLElement | null
  if (!stage) return
  const styles = getComputedStyle(stage)
  postSize.value = parseFloat(styles.getPropertyValue('--post-size')) || 280
  postSpacing.value = parseFloat(styles.getPropertyValue('--post-spacing')) || 16
  stageWidth.value = stage.clientWidth
}

function getCurrentIndex(): number {
  if (n.value === 0) return 0
  let idx = Math.round(-currentAngle.value / step.value) % n.value
  return ((idx % n.value) + n.value) % n.value
}

const sceneStyle = computed(() => ({
  perspective: `${perspective.value}px`
}))

const ringStyle = computed(() => ({
  transform: `rotateY(${currentAngle.value}deg)`,
  transition: canTransition.value
    ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
    : 'none'
}))

function getSlotStyle(i: number) {
  const angle = i * step.value
  return {
    transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`
  }
}

function setLock() {
  timer = setTimeout(() => { timer = null }, TRANSITION_MS)
}

function next() {
  if (timer || n.value <= 1) return
  canTransition.value = true
  currentAngle.value -= step.value
  setLock()
}

function prev() {
  if (timer || n.value <= 1) return
  canTransition.value = true
  currentAngle.value += step.value
  setLock()
}

function goTo(target: number) {
  if (n.value === 0) return
  target = ((target % n.value) + n.value) % n.value
  if (target === getCurrentIndex()) return

  canTransition.value = true
  currentAngle.value = -target * step.value
  setLock()
}

function getIndex(): number {
  return getCurrentIndex()
}

defineExpose({ next, prev, goTo, getIndex })

onMounted(() => {
  items.value = fisherYates(props.projects)
  currentAngle.value = 0
  requestAnimationFrame(() => updateDimensions())
  window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.carousel-3d-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-3d-ring {
  transform-style: preserve-3d;
  position: relative;
  width: var(--post-size);
  height: calc(var(--post-size) / 0.68);
}

.carousel-3d-slot {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-box-reflect: below 6px
    linear-gradient(transparent 55%, rgba(0, 0, 0, 0.3));
}

/* 清除 2D 布局遗留的 margin */
.carousel-3d-slot :deep(.carousel-item) {
  margin-right: 0;
}
</style>
