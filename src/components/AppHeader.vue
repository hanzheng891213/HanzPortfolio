<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <a class="header__logo" @click.prevent="navigateTo('home')">
        <span class="header__logo-icon">H</span>
        <span class="header__logo-text">Hanz</span>
      </a>
      <nav class="header__nav">
        <a
          class="header__link"
          :class="{ 'header__link--active': isHomeActive && activeSection === 'home' }"
          @click.prevent="navigateTo('home')"
        >
          首页
        </a>
        <a
          class="header__link"
          :class="{ 'header__link--active': isHomeActive && activeSection === 'portfolio' }"
          @click.prevent="navigateTo('portfolio')"
        >
          作品集
        </a>
        <a
          class="header__link"
          :class="{ 'header__link--active': isHomeActive && activeSection === 'blog' }"
          @click.prevent="navigateTo('blog')"
        >
          博客
        </a>
        <a
          class="header__link"
          :class="{ 'header__link--active': isHomeActive && activeSection === 'tech-stack' }"
          @click.prevent="navigateTo('tech-stack')"
        >
          技术栈
        </a>
      </nav>
      <div class="header__actions">
        <router-link to="/login" class="header__login-btn" :title="auth.isAuthenticated ? '已登录' : '登录'">
          <i class="fa-solid fa-circle-user header__login-icon"></i>
        </router-link>
        <button
          class="header__theme-btn"
          @click="theme.toggle()"
          :aria-label="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
          :title="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <i :class="theme.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" class="header__theme-icon"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const theme = useThemeStore()
const auth = useAuthStore()

const isHomeActive = computed(() => route.path === '/')

const scrolled = ref(false)
const activeSection = ref('home')

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top, behavior: 'smooth' })
    return true
  }
  return false
}

async function navigateTo(id: string) {
  if (route.path === '/') {
    scrollToSection(id)
    return
  }
  // Navigate back to home first
  await router.push('/')
  // Wait for lazy-loaded components to mount
  await nextTick()
  // Retry with increasing delays for deeply nested async components (e.g. BlogSection)
  for (const delay of [0, 50, 150, 350]) {
    await new Promise(r => setTimeout(r, delay))
    if (scrollToSection(id)) return
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 20

  const sections = ['home', 'portfolio', 'blog', 'tech-stack']
  const viewMiddle = window.scrollY + window.innerHeight / 3

  for (const id of sections) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.offsetTop
    const bottom = top + el.offsetHeight
    if (viewMiddle >= top && viewMiddle < bottom) {
      activeSection.value = id
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 18px 40px;
  transition: background 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
}

.header--scrolled {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 var(--glass-border);
  padding: 12px 40px;
}

.header__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright));
  color: var(--bg-primary);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0;
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px var(--accent-glow);
  opacity: 0.8;
}

.header__logo:hover .header__logo-icon {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 4px 16px var(--accent-glow-strong);
}

.header__logo:hover {
  color: var(--text-primary);
  transform: none;
}

.header__nav {
  display: flex;
  gap: 32px;
}

.header__link {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-secondary);
  position: relative;
  padding: 4px 0;
  transition: color 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.header__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.header__link:hover {
  color: var(--text-primary);
}

.header__link:hover::after,
.header__link--active::after {
  width: 100%;
}

.header__link--active {
  color: var(--accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__login-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: var(--text-secondary);
  transition: color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
}

.header__login-btn:hover {
  color: var(--accent);
  background: var(--bg-secondary);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.header__theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  color: var(--text-primary);
}

.header__theme-btn:hover {
  background: var(--bg-secondary);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

@media (max-width: 768px) {
  .header {
    padding: 10px 16px;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 var(--glass-border);
    -webkit-transform: translateZ(0);
    will-change: transform;
  }

  .header--scrolled {
    padding: 10px 16px;
  }

  .header__logo-text,
  .header__logo {
    font-size: 1.2rem;
  }

  .header__logo-icon {
    width: 30px;
    height: 30px;
    font-size: 0.95rem;
    border-radius: 8px;
  }

  .header__nav {
    gap: 14px;
  }

  .header__link {
    font-size: 0.82rem;
  }

  .header__theme-btn,
  .header__login-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}

@media (max-width: 380px) {
  .header__nav {
    gap: 10px;
  }

  .header__link {
    font-size: 0.78rem;
  }
}
</style>
