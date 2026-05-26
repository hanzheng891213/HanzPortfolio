<template>
  <div class="ambient-bg" aria-hidden="true">
    <div class="ambient-bg__glow ambient-bg__glow--top"></div>
    <div class="ambient-bg__glow ambient-bg__glow--bottom"></div>
    <div class="ambient-bg__noise"></div>
  </div>
</template>

<style scoped>
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-bg__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
}

.ambient-bg__glow--top {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -150px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
}

.ambient-bg__glow--bottom {
  width: 500px;
  height: 500px;
  bottom: -150px;
  left: -100px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 65%);
}

.ambient-bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
