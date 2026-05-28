<template>
  <div class="landing-page">
    <!-- ========== Hero Section ========== -->
    <section id="home" class="landing-section landing-section--hero">
      <div class="hero-visual">
        <ProfileCard />
      </div>
      <div class="hero-text">
        <h1>
          <span class="line">欢迎来到</span>
          <span class="line">我的</span>
          <span class="line accent">作品集网站</span>
        </h1>
        <p class="bio">
          欢迎来到我的作品集网站。很乐意跟您分享我的开发成果。如果您有意向同我合作，我将不胜感激。
        </p>
        <p class="bio bio--en">
          Welcome to my portfolio. I'm delighted to share my development work with you. If you're interested in collaborating, I'd be truly grateful.
        </p>
        <div class="hero-cta">
          <a class="btn btn-primary" @click.prevent="scrollTo('portfolio')">作品集</a>
          <a class="btn" @click.prevent="scrollTo('tech-stack')">技术栈</a>
        </div>
      </div>
    </section>

    <!-- ========== Portfolio Section ========== -->
    <section id="portfolio" class="landing-section landing-section--portfolio">
      <p class="section-tag">/ Portfolio</p>
      <h2 class="section-title">作品集</h2>
      <p class="section-subtitle">精选项目展示</p>
      <CarouselStage :projects="projects" />
    </section>

    <!-- ========== Tech Stack Section ========== -->
    <section id="tech-stack" class="landing-section landing-section--tech">
      <p class="section-tag">/ Tech Stack</p>
      <h2 class="section-title">技术栈</h2>
      <p class="section-subtitle">持续学习，不断精进的技术能力</p>
      <div class="skills-grid">
        <TechCard
          v-for="(skill, index) in skills"
          :key="skill.id"
          :category="skill.category"
          :description="skill.description"
          :icon="skill.icon"
          :index="index"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProfileCard from '@/components/ProfileCard.vue'
import CarouselStage from '@/components/CarouselStage.vue'
import TechCard from '@/components/TechCard.vue'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.landing-page {
  position: relative;
  z-index: 1;
}

.landing-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ========== Hero — two-column layout ========== */
.landing-section--hero {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 80px;
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 60px;
  position: relative;
}

.landing-section--hero::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  pointer-events: none;
}

.hero-visual {
  position: relative;
  flex-shrink: 0;
}

/* ── Hero text ── */
.hero-text {
  max-width: 520px;
}

.greeting {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-coral);
  margin-bottom: 16px;
}

.hero-text h1 {
  font-family: var(--font-display);
  font-size: clamp(48px, 7vw, 80px);
  line-height: 1.05;
  margin-bottom: 24px;
}

.hero-text h1 .line {
  display: block;
}

.hero-text h1 .line.accent {
  color: var(--accent);
}

.bio {
  font-size: 19px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
  font-style: italic;
}

.bio--en {
  font-size: 16px;
  margin-bottom: 36px;
  opacity: 0.8;
}

/* ── Buttons ── */
.hero-cta {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 1.5px;
  text-decoration: none;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.btn:hover::after {
  transform: translateY(0);
}

.btn:hover {
  color: var(--bg-primary);
  border-color: var(--accent);
}

.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg-primary);
}

.btn-primary::after {
  background: var(--bg-primary);
}

.btn-primary:hover {
  color: var(--accent);
}

/* ========== Section shared ========== */
.section-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-dim);
  margin-bottom: 16px;
  text-align: center;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  text-align: center;
}

.section-subtitle {
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 0rem;
  text-align: center;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}

/* Portfolio & Tech — spaced sections */
.landing-section--portfolio {
  padding-top: 40px;
  padding-bottom: 100px;
}

.landing-section--tech {
  padding-top: 40px;
  padding-bottom: 120px;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  grid-auto-flow: dense;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .landing-section--hero {
    flex-direction: column;
    gap: 48px;
    align-items: flex-start;
    padding-top: 100px;
  }

  .hero-visual {
    align-self: center;
  }
}

@media (max-width: 768px) {
  .landing-section {
    padding: 0 20px;
  }

  .landing-section--hero {
    min-height: 100vh;
    padding-top: 80px;
    padding-bottom: 60px;
  }

  .landing-section--hero::before {
    width: 300px;
    height: 300px;
    top: -60px;
    right: -40px;
  }

  .hero-text h1 {
    font-size: 36px;
  }

  .bio {
    font-size: 16px;
  }

  .bio--en {
    font-size: 14px;
  }

  .btn {
    padding: 12px 22px;
    font-size: 13px;
  }

  .landing-section--portfolio {
    padding-top: 20px;
    padding-bottom: 60px;
  }

  .landing-section--tech {
    padding-top: 20px;
    padding-bottom: 80px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
