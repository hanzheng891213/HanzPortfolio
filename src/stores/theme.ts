import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem('theme-dark')
  const isDark = ref(saved === null ? true : saved === 'true')

  function apply() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  watch(isDark, (val) => {
    localStorage.setItem('theme-dark', String(val))
    apply()
  }, { immediate: true })

  return { isDark, toggle, apply }
})
