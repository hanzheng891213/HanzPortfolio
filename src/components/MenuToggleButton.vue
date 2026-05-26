<template>
  <button
    class="menu-btn"
    :class="{ 'menu-btn--active': active }"
    @click="$emit('toggle')"
    aria-label="切换联系方式菜单"
    :title="active ? '收起联系方式' : '查看联系方式'"
  >
    <span></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.menu-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  z-index: 10;
  background: var(--bg-secondary);
  transition: background 0.3s ease;
  animation: pop-btn 0.3s both ease-in-out 0.5s,
    heartbeat 2s ease-in-out 1.8s infinite;
}

.menu-btn:hover {
  animation: pop-btn 0.3s both ease-in-out 0.5s;
  box-shadow: 0 0 0 6px var(--accent-glow);
}

.menu-btn--active {
  animation: pop-btn 0.3s both ease-in-out 0.5s;
}

@keyframes pop-btn {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--accent-glow);
  }
  12% {
    transform: scale(1.3);
    box-shadow: 0 0 0 2px var(--accent-glow);
  }
  24% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--accent-glow);
  }
  36% {
    transform: scale(1.2);
    box-shadow: 0 0 0 1px var(--accent-glow);
  }
  48% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--accent-glow);
  }
}

/* Three lines via span + pseudo-elements */
.menu-btn span {
  width: 54%;
  height: 2px;
  background: var(--text-primary);
  position: absolute;
  top: 50%;
  left: 23%;
  transform: translateY(-50%);
  animation: to-hamburger 0.3s forwards ease-in-out;
  border-radius: 1px;
}

.menu-btn span::before,
.menu-btn span::after {
  content: "";
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  position: absolute;
  right: 0;
  border-radius: 1px;
  transform: rotate(0deg);
  transition: transform 0.3s ease, width 0.3s ease, margin-top 0.3s ease;
}

.menu-btn span::before {
  margin-top: -7px;
}

.menu-btn span::after {
  margin-top: 7px;
}

/* Active — arrow state */
.menu-btn--active span {
  animation: to-arrow 0.3s forwards ease-in-out;
}

.menu-btn--active span::before,
.menu-btn--active span::after {
  width: 54%;
  right: -1px;
}

.menu-btn--active span::before {
  transform: rotate(45deg);
}

.menu-btn--active span::after {
  transform: rotate(-45deg);
}

@keyframes to-hamburger {
  from {
    transform: translateY(-50%) rotate(-180deg);
  }
}

@keyframes to-arrow {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(180deg);
  }
}
</style>
