<template>
  <button
    class="menu-btn"
    :class="{ 'menu-btn--active': active }"
    @click="$emit('toggle')"
    aria-label="切换联系方式菜单"
    :title="active ? '收起联系方式' : '查看联系方式'"
  >
    <Transition name="icon-swap" mode="out-in">
      <FontAwesomeIcon
        v-if="active"
        key="info"
        :icon="['fas', 'circle-info']"
        class="menu-btn__icon"
      />
      <FontAwesomeIcon
        v-else
        key="heart"
        :icon="['fas', 'heart']"
        class="menu-btn__icon"
      />
    </Transition>
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
  width: 44px;
  height: 44px;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  z-index: 10;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-btn 0.3s both ease-in-out 0.5s,
    heartbeat 2.2s ease-in-out 1.8s infinite;
}

.menu-btn__icon {
  font-size: 1.8rem;
  color: var(--accent-coral);
}

.menu-btn--active .menu-btn__icon {
  color: var(--accent);
}

/* ── Icon swap transitions ── */
.icon-swap-enter-active {
  animation: icon-in 0.35s ease;
}

.icon-swap-leave-active {
  animation: icon-out 0.35s ease;
}

@keyframes icon-in {
  from {
    transform: scale(0) rotate(-120deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes icon-out {
  from {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: scale(0) rotate(120deg);
    opacity: 0;
  }
}

/* ── Button animations ── */
@keyframes pop-btn {
  0%   { transform: scale(0); }
  80%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14%      { transform: scale(1.25); }
  28%      { transform: scale(1); }
  42%      { transform: scale(1.15); }
  56%      { transform: scale(1); }
}
</style>
