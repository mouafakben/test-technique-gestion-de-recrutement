<script setup lang="ts">
import { computed, onMounted, ref, h, resolveComponent, watch } from 'vue'
import type { Candidature } from '@/types/candidature'
import type { TableColumn } from '@nuxt/ui'
import { useCandidatureStore } from '@/stores/CandidatureStore'

const candidatureStore = useCandidatureStore()

const search = ref('')
const statutFilter = ref('all')
const competenceFilter = ref('')
const dateFilter = ref('')
const page = ref(1)
const limit = 10

const statutOptions = computed(() => [
    { label: 'Tous les statuts', value: 'all' },
    ...candidatureStore.statuts.map(s => ({ label: s.nom, value: s.nom }))
])

const fetchData = () => {
    candidatureStore.getCandidatures({
        ...(search.value && { q: search.value }),
        ...(statutFilter.value !== 'all' && { statut: statutFilter.value }),
        ...(competenceFilter.value && { competences_like: competenceFilter.value }),
        ...(dateFilter.value && { dateCandidature: dateFilter.value }),
        _page: page.value,
        _limit: limit,
    })
}

onMounted(async () => {
    await candidatureStore.getStatuts()
    fetchData()
})

watch([search, statutFilter, competenceFilter, dateFilter], () => {
    page.value = 1
    fetchData()
})

watch(page, fetchData)

const data = computed<Candidature[]>(() => candidatureStore.condidatures)
const total = computed(() => candidatureStore.total)

// --- Modal ---
const isOpen = ref(false)
const selectedCandidat = computed(() => candidatureStore.selectedCandidature)
const loadingDetail = computed(() => candidatureStore.loadingDetail)

async function openModal(candidat: Candidature) {
    isOpen.value = true
    await candidatureStore.getCandidatureById(candidat.id)
}

const columns: TableColumn<Candidature>[] = [
    { accessorKey: 'id', header: 'id' },
    { accessorKey: 'nom', header: 'Nom' },
    { accessorKey: 'poste', header: 'Poste' },
    {
        accessorKey: 'statut',
        header: 'Statut',
        cell: ({ row }) => {
            const statut = candidatureStore.statuts.find(s => s.nom === row.getValue('statut'))
            return h(resolveComponent('UBadge'), {
                label: row.getValue('statut'),
                variant: 'subtle',
                style: statut ? `color: ${statut.couleur}; border-color: ${statut.couleur}` : ''
            })
        }
    },
    { accessorKey: 'dateCandidature', header: 'Date de candidature' },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => h(resolveComponent('UButton'), {
            label: 'Voir détails',
            color: 'primary',
            variant: 'subtle',
            size: 'sm',
            onClick: () => openModal(row.original)
        })
    }
]
</script>

<template>
    <!-- title: Liste toutes les candidatures -->
     
    <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-3">
            <UInput v-model="search" placeholder="Rechercher..." icon="i-lucide-search" class="w-56" />
            <USelect v-model="statutFilter" :items="statutOptions" placeholder="Statut" class="w-48" />
            <UInput v-model="competenceFilter" placeholder="Compétence (ex: Vue)" icon="i-lucide-filter" class="w-48" />
            <UInput v-model="dateFilter" type="date" class="w-48" />
            <UButton label="Réinitialiser" color="neutral" variant="subtle" icon="i-lucide-x"
                @click="() => { search = ''; statutFilter = 'all'; competenceFilter = ''; dateFilter = '' }" />
        </div>

        <UTable :data="data" :columns="columns" :loading="candidatureStore.loading" class="flex-1" />

        <div class="flex justify-end">
            <UPagination v-model:page="page" :total="total" :items-per-page="limit" show-edges />
        </div>
    </div>

    <!-- Modal -->
    <UModal v-model:open="isOpen" :title="selectedCandidat?.nom" description="Détails du candidat">
        <template #body>
            <!-- Loading state -->
            <div v-if="loadingDetail" class="flex justify-center py-6">
                <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl text-primary" />
            </div>

            <!-- Content -->
            <div v-else-if="selectedCandidat" class="space-y-3 text-sm">
                <!-- dateCandidature -->
                <div class="flex justify-between">
                    <span class="text-muted">Date de candidature</span>
                    <div class="flex gap-2 text-sm">
                        <span>{{ new Date(selectedCandidat.dateCandidature).toLocaleDateString() }}</span>
                        <span>{{ new Date(selectedCandidat.dateCandidature).toLocaleTimeString() }}</span>
                    </div>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Email</span>
                    <span>{{ selectedCandidat.email }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Téléphone</span>
                    <span>{{ selectedCandidat.telephone }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Expérience</span>
                    <span>{{ selectedCandidat.experience }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Localisation</span>
                    <span>{{ selectedCandidat.localisation }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Salaire souhaité</span>
                    <span>{{ selectedCandidat.salaireSouhaite }} DA</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Disponibilité</span>
                    <span>{{ selectedCandidat.disponibilite }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-muted">Compétences</span>
                    <div class="flex flex-wrap gap-1">
                        <UBadge v-for="c in selectedCandidat.competences" :key="c" :label="c" variant="subtle" />
                    </div>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">CV</span>
                    <a :href="selectedCandidat.cv" target="_blank" class="text-primary underline">Voir CV</a>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-muted">Lettre de motivation</span>
                    <UCard v-if="selectedCandidat.lettreMotivation" class="bg-gray-50 dark:bg-gray-900">
                        <p class="text-sm leading-relaxed">{{ selectedCandidat.lettreMotivation }}</p>
                    </UCard>
                    <div v-else class="text-sm text-muted">Aucune présentation</div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-muted">Commentaires</span>
                    <div v-if="selectedCandidat.commentaires.length === 0" class="text-sm text-muted">Aucun commentaire
                    </div>
                    <div v-else class="space-y-2">
                        <div v-for="com in selectedCandidat.commentaires" :key="com.id" class="p-2 border rounded">
                            <div class="flex justify-between text-sm">
                                <span class="font-medium">{{ com.auteur }}</span>
                                <span class="text-muted">{{ new Date(com.date).toLocaleDateString() }}</span>
                            </div>
                            <p class="mt-1 text-sm">{{ com.contenu }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </UModal>
</template>