import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Poste } from '@/types/poste'

export const usePosteStore = defineStore('postes', () => {
  const postes = ref<Poste[]>([])
  const loading = ref(false)

  const getPostes = async () => {
    loading.value = true
    const base_url = import.meta.env.VITE_BASE_PATH || ''
    const response = await fetch(`${base_url}/postes`)
    postes.value = await response.json()
    loading.value = false
  }

  return { postes, loading, getPostes }
})
