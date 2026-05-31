<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">Hanzheng</div>
      <div class="footer__links">
        <a href="https://github.com/hanzheng891213" target="_blank" rel="noopener" class="footer__link">
          GitHub
        </a>
        <a href="mailto:1728907574@qq.com" class="footer__link">
          邮箱
        </a>
      </div>
      <p class="footer__copy">&copy; {{ year }} Hanzheng. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border-color);
  padding: 40px;
  text-align: center;
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer__brand {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.footer__link {
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.footer__link:hover {
  color: var(--accent);
}

.footer__copy {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer {
    padding: 22px 16px;
  }

  .footer__brand {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .footer__links {
    gap: 20px;
    margin-bottom: 10px;
  }

  .footer__link {
    font-size: 0.82rem;
  }

  .footer__copy {
    font-size: 0.72rem;
  }
}
</style>
