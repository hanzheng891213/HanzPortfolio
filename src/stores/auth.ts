import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogUser } from '@/types'
import { login as authLogin, logout as authLogout, getStoredUser } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<BlogUser | null>(getStoredUser())
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    const result = await authLogin(email, password)
    user.value = result.user
    return result
  }

  async function logout() {
    await authLogout()
    user.value = null
  }

  return { user, isAuthenticated, isAdmin, login, logout }
})
