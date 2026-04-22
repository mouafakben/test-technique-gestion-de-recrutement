import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Candidature, Status } from '@/types/candidature'
import { candidatureRepository } from '@/repositories/candidatureRepository'

export const useCandidatureStore = defineStore('condidatures', () => {
  const condidatures = ref<Candidature[]>([])
  const selectedCandidature = ref<Candidature | null>(null)
  const statuts = ref<Status[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)

  const getCandidatures = async (params: Record<string, string | number> = {}) => {
    loading.value = true
    try {
      const { data, total: count } = await candidatureRepository.getAll(params)
      condidatures.value = data
      total.value = count
    } finally {
      loading.value = false
    }
  }

  const getStatuts = async () => {
    statuts.value = await candidatureRepository.getStatuts()
  }

  const getCandidatureById = async (id: number) => {
    loadingDetail.value = true
    selectedCandidature.value = null
    try {
      selectedCandidature.value = await candidatureRepository.getById(id)
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