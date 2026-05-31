<template>
  <div class="login-page">
    <div class="login-card">
      <p class="login-tag">/ Auth</p>
      <h1 class="login-title">登录</h1>
      <p class="login-subtitle">登录后可点赞和管理博客</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="login-field">
          <label class="login-label" for="email">邮箱</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="login-input"
            placeholder="your@email.com"
            required
          />
        </div>
        <div class="login-field">
          <label class="login-label" for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="login-input"
            placeholder="密码"
            required
          />
        </div>
        <p v-if="errMsg" class="login-error">{{ errMsg }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errMsg.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = (router.currentRoute.value.query.redirect as string) || '/blog/admin'
    router.push(redirect)
  } catch (e: any) {
    errMsg.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 40px 80px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 48px 40px;
}

.login-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-dim);
  margin-bottom: 12px;
  text-align: center;
}

.login-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 36px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: var(--font-body);
}

.login-input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.login-input:focus {
  border-color: var(--accent);
}

.login-error {
  font-size: 0.85rem;
  color: var(--color-danger);
  text-align: center;
}

.login-btn {
  padding: 14px;
  font-family: var(--font-btn);
  font-size: 14px;
  letter-spacing: 2px;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-glow-strong);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-page {
    padding: 100px 20px 60px;
  }

  .login-card {
    padding: 32px 24px;
  }
}
</style>
