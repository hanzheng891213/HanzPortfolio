import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 禁用浏览器原生滚动恢复，交给 vue-router scrollBehavior 统一管理
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('@/views/BlogListView.vue')
    },
    {
      path: '/blog/admin',
      name: 'blog-admin',
      component: () => import('@/views/BlogAdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('@/views/BlogDetailView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
