import { onMounted, onUnmounted, type Ref } from 'vue'

export function useTouchSwipe(
  targetRef: Ref<HTMLElement | null>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50
) {
  let touchStartX = 0
  let touchStartY = 0

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  function onTouchEnd(e: TouchEvent) {
    const dx = touchStartX - e.changedTouches[0].clientX
    const dy = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx > 0) onSwipeLeft()
      else onSwipeRight()
    }
  }

  onMounted(() => {
    targetRef.value?.addEventListener('touchstart', onTouchStart, { passive: true })
    targetRef.value?.addEventListener('touchend', onTouchEnd)
  })

  onUnmounted(() => {
    targetRef.value?.removeEventListener('touchstart', onTouchStart)
    targetRef.value?.removeEventListener('touchend', onTouchEnd)
  })
}
