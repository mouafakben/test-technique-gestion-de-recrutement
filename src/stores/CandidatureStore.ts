import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Candidature, Status } from '@/types/candidature'
import { useToast } from '@nuxt/ui/composables'

export const useCandidatureStore = defineStore('condidatures', () => {
  const toast = useToast()

  const condidatures = ref<Candidature[]>([])
  const selectedCandidature = ref<Candidature | null>(null)
  const statuts = ref<Status[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)

  const base_url = import.meta.env.VITE_BASE_PATH || ''

  const getCandidatures = async (params: Record<string, string | number> = {}) => {
    loading.value = true
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          query.append(key, String(value))
        }
      })
      const response = await fetch(`${base_url}/candidatures?${query.toString()}`)
      if (!response.ok) throw new Error('Erreur lors du chargement des candidatures')
      total.value = Number(response.headers.get('X-Total-Count')) || 0
      condidatures.value = await response.json()
    } catch (error) {
      // should be bubbled up to the related component
      toast.add({ title: 'Erreur', description: (error as Error).message, color: 'error' })
    } finally {
      loading.value = false
    }
  }

  const getStatuts = async () => {
    try {
      const response = await fetch(`${base_url}/statuts`)
      if (!response.ok) throw new Error('Erreur lors du chargement des statuts')
      statuts.value = await response.json()
    } catch (error) {
      toast.add({ title: 'Erreur', description: (error as Error).message, color: 'error' })
    }
  }

  const getCandidatureById = async (id: number) => {
    loadingDetail.value = true
    selectedCandidature.value = null
    try {
      const response = await fetch(`${base_url}/candidatures/${id}`)
      if (!response.ok) throw new Error('Candidature introuvable')
      selectedCandidature.value = await response.json()
    } catch (error) {
      toast.add({ title: 'Erreur', description: (error as Error).message, color: 'error' })
    } finally {
      loadingDetail.value = false
    }
  }

  return {
    condidatures,
    total,
    loading,
    loadingDetail,
    statuts,
    selectedCandidature,
    getCandidatures,
    getStatuts,
    getCandidatureById,
  }
})