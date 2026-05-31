import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types'
import {
  getPosts, getPostById, createPost, updatePost, deletePost,
  incrementView, hasLiked, like, resetAllData
} from '@/services/blogService'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const currentPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const sortedPosts = computed(() =>
    [...posts.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  async function fetchPosts() {
    loading.value = true
    try {
      posts.value = await getPosts()
    } finally {
      loading.value = false
    }
  }

  async function fetchPostById(id: number) {
    loading.value = true
    try {
      currentPost.value = await getPostById(id) || null
      return currentPost.value
    } finally {
      loading.value = false
    }
  }

  async function addPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'viewCount'>) {
    const newPost = await createPost(post)
    posts.value.unshift(newPost)
    return newPost
  }

  async function editPost(id: number, data: Partial<BlogPost>) {
    const updated = await updatePost(id, data)
    if (updated) {
      const idx = posts.value.findIndex(p => p.id === id)
      if (idx !== -1) posts.value[idx] = updated
      if (currentPost.value?.id === id) currentPost.value = updated
    }
    return updated
  }

  async function removePost(id: number) {
    const ok = await deletePost(id)
    if (ok) {
      posts.value = posts.value.filter(p => p.id !== id)
      if (currentPost.value?.id === id) currentPost.value = null
    }
    return ok
  }

  async function viewPost(id: number, userEmail?: string) {
    const count = await incrementView(id, userEmail)
    const post = posts.value.find(p => p.id === id)
    if (post) post.viewCount = count
    if (currentPost.value?.id === id) currentPost.value.viewCount = count
    return count
  }

  async function checkLiked(postId: number, userEmail: string) {
    return hasLiked(postId, userEmail)
  }

  async function resetAll() {
    await resetAllData()
    posts.value = []
    currentPost.value = null
    await fetchPosts()
  }

  async function likePost(postId: number, userEmail: string) {
    const result = await like(postId, userEmail)
    const post = posts.value.find(p => p.id === postId)
    if (post) post.likeCount = result.likeCount
    if (currentPost.value?.id === postId) currentPost.value.likeCount = result.likeCount
    return result
  }

  return {
    posts, currentPost, loading, sortedPosts,
    fetchPosts, fetchPostById, addPost, editPost, removePost,
    viewPost, checkLiked, likePost, resetAll
  }
})
