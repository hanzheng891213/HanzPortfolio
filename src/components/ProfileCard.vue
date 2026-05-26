<template>
  <div class="profile-card">
    <div class="card-head"></div>
    <img
      class="avatar"
      src="@/assets/img/profile-img.jpg"
      alt="Hanzheng 的头像"
    />
    <div class="card-body">
      <div class="name">
        Han Zheng
        <span class="cn">韩 政</span>
      </div>
      <div class="role">Frontend Developer</div>
    </div>

    <!-- Decorative accent line -->
    <div class="profile-card__accent"></div>

    <!-- Menu toggle button -->
    <MenuToggleButton :active="menuOpen" @toggle="menuOpen = !menuOpen" />

    <!-- Contact fan-out menu -->
    <ContactMenu :open="menuOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuToggleButton from './MenuToggleButton.vue'
import ContactMenu from './ContactMenu.vue'

const menuOpen = ref(false)
</script>

<style scoped>
.profile-card {
  position: relative;
  width: 340px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  overflow: visible;
  flex-shrink: 0;
}

/* ── Skewed header image ── */
.card-head {
  height: 220px;
  position: relative;
  overflow: hidden;
}

.card-head::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #43dfea24;
  transform-origin: 0 0;
}

/* ── Overlapping circular avatar ── */
.avatar {
  position: absolute;
  top: 170px;
  left: 28px;
  width: 130px;
  height: 130px;
  z-index: 3;
  border-radius: 50%;
  border: 6px solid var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-dim), 0 8px 30px rgba(0, 0, 0, 0.5);
  object-fit: cover;
  opacity: 0.9;
}
.avatar:hover {
  transform: scale(1.1);
  opacity: 1;
  transition: all 0.3s ease-in-out;
}
/* ── Card body ── */
.card-body {
  padding: 80px 28px 32px;
}

.name {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-primary);
}

.name .cn {
  display: block;
  font-family: var(--font-kai);
  font-size: 24px;
  margin-top: 4px;
  color: var(--accent);
}

.role {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

/* Accent line */
.profile-card__accent {
  position: absolute;
  top: -1px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  z-index: 6;
}

@media (max-width: 768px) {
  .profile-card {
    width: 280px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    top: 150px;
    left: 20px;
  }
  .card-body {
    padding: 60px 20px 24px;
  }

  .name {
    font-size: 24px;
  }

  .name .cn {
    font-size: 20px;
  }
}
</style>
