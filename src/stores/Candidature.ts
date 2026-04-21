import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCandidatureStore = defineStore('condidatures', () => {
  const condidatures = ref([])
  const getCandidatures = async () => {
    const base_url = import.meta.env.VITE_BASE_PATH || ''
    console.log('Fetching candidatures from:', base_url)
    const response = await fetch(`${base_url}/candidatures`)
    const data = await response.json()
    condidatures.value = data
  }

  return { condidatures, getCandidatures }
})
