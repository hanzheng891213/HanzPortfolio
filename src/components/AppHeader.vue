<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <a class="header__logo" @click.prevent="scrollTo('home')">
        <div class="header__logo-text">Han Zheng</div>
      </a>
      <nav class="header__nav">
        <a
          class="header__link"
          :class="{ 'header__link--active': activeSection === 'home' }"
          @click.prevent="scrollTo('home')"
        >
          首页
        </a>
        <a
          class="header__link"
          :class="{ 'header__link--active': activeSection === 'portfolio' }"
          @click.prevent="scrollTo('portfolio')"
        >
          作品集
        </a>
        <a
          class="header__link"
          :class="{ 'header__link--active': activeSection === 'tech-stack' }"
          @click.prevent="scrollTo('tech-stack')"
        >
          技术栈
        </a>
      </nav>
      <button
        class="header__theme-btn"
        @click="theme.toggle()"
        :aria-label="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
        :title="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <FontAwesomeIcon :icon="theme.isDark ? ['fas', 'sun'] : ['fas', 'moon']" class="header__theme-icon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const scrolled = ref(false)
const activeSection = ref('home')

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 20

  const sections = ['home', 'portfolio', 'tech-stack']
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

.header__logo-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
}

.header__logo-text:hover {
  color: var(--accent);
  transform: scale(0.95)  translateY(-1px);
  transition: ease-in-out;
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

  .header__logo-text {
    font-size: 1.2rem;
  }

  .header__nav {
    gap: 14px;
  }

  .header__link {
    font-size: 0.82rem;
  }

  .header__theme-btn {
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
