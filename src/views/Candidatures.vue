<script setup lang="ts">
import { computed, onMounted, ref, h, resolveComponent } from 'vue'
import type { Candidature } from "@/types/types"
import type { TableColumn } from '@nuxt/ui'

import { useCandidatureStore } from '@/stores/Candidature'
const candidatureStore = useCandidatureStore()

onMounted(async () => {
    candidatureStore.getCandidatures()
})

const data = computed<Candidature[]>(() => candidatureStore.condidatures)

const selectedCandidat = ref<Candidature | null>(null)
const isOpen = ref(false)

function openModal(candidat: Candidature) {
    selectedCandidat.value = candidat
    isOpen.value = true
}

const columns: TableColumn<Candidature>[] = [
    { accessorKey: 'nom', header: 'Nom' },
    { accessorKey: 'poste', header: 'Poste' },
    { accessorKey: 'statut', header: 'Statut' },
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
    <UTable :data="data" :columns="columns" class="flex-1" />

    <UModal v-model:open="isOpen" :title="selectedCandidat?.nom" description="Détails du candidat">
        <template #body>
            <div v-if="selectedCandidat" class="space-y-3 text-sm">
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
                <div class="flex-col justify-between">
                    <span class="text-muted">Lettre de motivation</span>
                    <p class="max-w-md">{{ selectedCandidat.lettreMotivation }}</p>
                </div>
            </div>
        </template>
    </UModal>
</template>