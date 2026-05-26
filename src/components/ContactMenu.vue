<template>
  <div class="contact-box" :class="{ 'contact-box--open': open }" :aria-hidden="!open">
    <a
      v-for="(item, i) in contacts"
      :key="i"
      :href="item.link"
      :target="item.link.startsWith('http') ? '_blank' : undefined"
      :rel="item.link.startsWith('http') ? 'noopener' : undefined"
      class="contact-item"
      :title="item.label"
      @click="handleItemClick(item)"
    >
      <FontAwesomeIcon :icon="item.icon" class="contact-item__icon" />
      <span class="contact-item__label">{{ item.label }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { contacts, type ContactItem } from '@/data/contacts'
import { copyToClipboard } from '@/utils'

defineProps<{
  open: boolean
}>()

function handleItemClick(item: ContactItem) {
  if (item.link) return
  copyToClipboard(item.copyValue)
}
</script>

<style scoped>
.contact-box {
  position: absolute;
  top: 41px;
  right: 41px;
  transform: translate(50%, -50%);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 5;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.contact-box--open {
  opacity: 1;
  pointer-events: auto;
}

.contact-item {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 16px var(--shadow-color);
  position: absolute;
  left: -6px;
  top: calc(20px - 26px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.contact-item:hover {
  transition-delay: initial !important;
  box-shadow: 0 0 0 6px var(--accent-glow);
  border-color: var(--accent);
}

.contact-item__icon {
  font-size: 18px;
  color: var(--text-primary);
  line-height: 1;
}

.contact-item__label {
  font-family: var(--font-mono);
  font-size: 0.5rem;
  color: var(--text-secondary);
  white-space: nowrap;
  position: absolute;
  bottom: -18px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contact-item:hover .contact-item__label {
  opacity: 1;
}

/* Open state — fan-out: 180° arc, -90° to +90° */
.contact-box--open .contact-item {
  left: 20px;
  opacity: 1;
}

.contact-box--open .contact-item:nth-child(1) {
  transform: rotate(-90deg) translateX(110px) rotate(90deg);
  transition-delay: 0s;
}

.contact-box--open .contact-item:nth-child(2) {
  transform: rotate(-45deg) translateX(110px) rotate(45deg);
  transition-delay: 0.1s;
}

.contact-box--open .contact-item:nth-child(3) {
  transform: rotate(0deg) translateX(120px) rotate(0deg);
  transition-delay: 0.2s;
}

.contact-box--open .contact-item:nth-child(4) {
  transform: rotate(45deg) translateX(110px) rotate(-45deg);
  transition-delay: 0.3s;
}

.contact-box--open .contact-item:nth-child(5) {
  transform: rotate(90deg) translateX(100px) rotate(-90deg);
  transition-delay: 0.4s;
}

/* ── Mobile: vertical dropdown instead of radial fan ── */
@media (max-width: 600px) {
  .contact-box {
    top: 16px;
    right: 16px;
    transform: none;
    border-radius: 8px;
    width: auto;
    height: auto;
    min-width: 200px;
  }

  .contact-box--open {
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px var(--shadow-color);
    border-radius: 8px;
    padding: 8px 0;
    top: 72px;
    right: 8px;
  }

  .contact-item {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: auto;
    border-radius: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 10px 16px;
    transition: background 0.2s ease;
  }

  .contact-item:hover {
    background: var(--bg-card-hover);
    box-shadow: none;
    border-color: transparent;
  }

  .contact-item__icon {
    font-size: 16px;
    flex-shrink: 0;
    width: 20px;
    text-align: center;
  }

  .contact-item__label {
    position: static;
    opacity: 1;
    font-size: 0.78rem;
    white-space: normal;
  }

  /* Reset all fan-out transforms on mobile */
  .contact-box--open .contact-item {
    left: auto;
    transform: none !important;
    transition-delay: 0s !important;
  }
}
</style>
