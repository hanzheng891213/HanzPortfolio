import { onMounted, onUnmounted, type Ref } from 'vue'

export interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  delay?: number
}

export function useScrollReveal(
  elRef: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px 40px 0px', delay = 0 } = options

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = elRef.value
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(24px) scale(0.96)'
    el.style.transition = `opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed')
          } else {
            entry.target.classList.remove('scroll-revealed')
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
