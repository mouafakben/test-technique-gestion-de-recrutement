// stores/Candidature.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Candidature, Status } from '@/types/candidature'

export const useCandidatureStore = defineStore('condidatures', () => {
  const condidatures = ref<Candidature[]>([])
  const selectedCandidature = ref<Candidature | null>(null)
  const statuts = ref<Status[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)

  const base_url = import.meta.env.VITE_BASE_PATH || ''
  const getCandidatures = async (params: Record<string, string | number> = {}) => {
    loading.value = true

    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        query.append(key, String(value))
      }
    })

    const response = await fetch(`${base_url}/candidatures?${query.toString()}`)
    total.value = Number(response.headers.get('X-Total-Count')) || 0
    condidatures.value = await response.json()
    loading.value = false
  }

  const getStatuts = async () => {
    const response = await fetch(`${base_url}/statuts`)
    statuts.value = await response.json()
  }
  const getCandidatureById = async (id: number) => {
    loadingDetail.value = true
    const response = await fetch(`${base_url}/candidatures/${id}`)
    selectedCandidature.value = await response.json()
    loadingDetail.value = false
  }
  return {
    condidatures,
    total,
    loading,
    getCandidatures,
    getStatuts,
    statuts,
    selectedCandidature,
    getCandidatureById,
    loadingDetail,
  }
})
