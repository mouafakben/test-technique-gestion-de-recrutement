<script setup lang="ts">
import { computed, onMounted, ref, h, resolveComponent, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from '@nuxt/ui/composables'
import type { Candidature } from '@/types/candidature'
import type { TableColumn } from '@nuxt/ui'
import { useCandidatureStore } from '@/stores/CandidatureStore'

const candidatureStore = useCandidatureStore()
const toast = useToast()

const search = ref('')
const statutFilter = ref('all')
const competenceFilter = ref('')
const dateFilter = ref('')
const page = ref(1)
const limit = 10

const statutOptions = computed(() => [
  { label: 'Tous les statuts', value: 'all' },
  ...candidatureStore.statuts.map((s) => ({ label: s.nom, value: s.nom })),
])

const handleError = (error: unknown) => {
  toast.add({
    title: 'Erreur',
    description: (error as Error).message,
    color: 'error',
  })
}

const fetchData = async () => {
  try {
    await candidatureStore.getCandidatures({
      ...(search.value && { q: search.value }),
      ...(statutFilter.value !== 'all' && { statut: statutFilter.value }),
      ...(competenceFilter.value && { competences_like: competenceFilter.value }),
      ...(dateFilter.value && { dateCandidature: dateFilter.value }),
      _page: page.value,
      _limit: limit,
    })
  } catch (error) {
    handleError(error)
  }
}

const debouncedFetch = useDebounceFn(async () => {
  page.value = 1
  await fetchData()
}, 300)

onMounted(async () => {
  try {
    await candidatureStore.getStatuts()
    await fetchData()
  } catch (error) {
    handleError(error)
  }
})

watch([search, competenceFilter], debouncedFetch)

watch([statutFilter, dateFilter], async () => {
  page.value = 1
  await fetchData()
})

watch(page, fetchData)

const data = computed<Candidature[]>(() => candidatureStore.condidatures)
const total = computed(() => candidatureStore.total)

const isOpen = ref(false)
const selectedCandidat = computed(() => candidatureStore.selectedCandidature)
const loadingDetail = computed(() => candidatureStore.loadingDetail)

async function openModal(candidat: Candidature) {
  isOpen.value = true
  try {
    await candidatureStore.getCandidatureById(candidat.id)
  } catch (error) {
    handleError(error)
  }
}

function resetFilters() {
  search.value = ''
  statutFilter.value = 'all'
  competenceFilter.value = ''
  dateFilter.value = ''
}

const columns: TableColumn<Candidature>[] = [
  { accessorKey: 'nom', header: 'Nom' },
  { accessorKey: 'poste', header: 'Poste' },
  {
    accessorKey: 'statut',
    header: 'Statut',
    cell: ({ row }) => {
      const value = row.getValue('statut') as string
      const statut = candidatureStore.statuts.find((s) => s.nom === value)
      return h(resolveComponent('UBadge'), {
        label: value,
        variant: 'subtle',
        style: statut ? `color: ${statut.couleur}; border-color: ${statut.couleur}` : '',
      })
    },
  },
  { accessorKey: 'dateCandidature', header: 'Date de candidature' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h(resolveComponent('UButton'), {
        label: 'Voir détails',
        color: 'primary',
        variant: 'subtle',
        size: 'sm',
        onClick: () => openModal(row.original),
      }),
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">

    <!-- Title -->
    <h2 class="text-xl font-semibold">Liste des candidatures</h2>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <UInput v-model="search" placeholder="Rechercher..." icon="i-lucide-search" class="w-56" />
      <USelect v-model="statutFilter" :items="statutOptions" placeholder="Statut" class="w-48" />
      <UInput v-model="competenceFilter" placeholder="Compétence (ex: Vue)" icon="i-lucide-filter" class="w-48" />
      <UInput v-model="dateFilter" type="date" class="w-48" />
      <UButton label="Réinitialiser" color="neutral" variant="subtle" icon="i-lucide-x" @click="resetFilters" />
    </div>

    <!-- Table -->
    <UTable :data="data" :columns="columns" :loading="candidatureStore.loading" empty="Aucune candidature trouvée"
      class="flex-1" />

    <!-- Pagination -->
    <div class="flex justify-end">
      <UPagination v-model:page="page" :total="total" :items-per-page="limit" show-edges />
    </div>

  </div>

  <!-- Modal -->
  <CandidatureDetailModal v-model:open="isOpen" :candidature="selectedCandidat" :loading="loadingDetail" />
</template>