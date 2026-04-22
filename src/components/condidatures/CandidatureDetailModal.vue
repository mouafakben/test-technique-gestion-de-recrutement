<script setup lang="ts">
import type { Candidature } from '@/types/candidature'

const props = defineProps<{
    candidature: Candidature | null
    loading: boolean
}>()

const isOpen = defineModel<boolean>('open', { required: true })
</script>

<template>
    <UModal v-model:open="isOpen" :title="props.candidature?.nom" description="Détails du candidat">
        <template #body>
            <!-- Loading state -->
            <div v-if="props.loading" class="flex justify-center py-6">
                <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl text-primary" />
            </div>

            <!-- Content -->
            <div v-else-if="props.candidature" class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-muted">Date de candidature</span>
                    <div class="flex gap-2">
                        <span>{{ new Date(props.candidature.dateCandidature).toLocaleDateString() }}</span>
                        <span>{{ new Date(props.candidature.dateCandidature).toLocaleTimeString() }}</span>
                    </div>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Email</span>
                    <span>{{ props.candidature.email }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Téléphone</span>
                    <span>{{ props.candidature.telephone }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Expérience</span>
                    <span>{{ props.candidature.experience }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Localisation</span>
                    <span>{{ props.candidature.localisation }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Salaire souhaité</span>
                    <span>{{ props.candidature.salaireSouhaite }} DA</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Disponibilité</span>
                    <span>{{ props.candidature.disponibilite }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-muted">Compétences</span>
                    <div class="flex flex-wrap gap-1">
                        <UBadge v-for="c in props.candidature.competences" :key="c" :label="c" variant="subtle" />
                    </div>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">CV</span>
                    <a :href="props.candidature.cv" target="_blank" class="text-primary underline">Voir CV</a>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-muted">Lettre de motivation</span>
                    <UCard v-if="props.candidature.lettreMotivation">
                        <p class="text-sm leading-relaxed">{{ props.candidature.lettreMotivation }}</p>
                    </UCard>
                    <span v-else class="text-sm text-muted">Aucune lettre de motivation</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-muted">Commentaires</span>
                    <span v-if="props.candidature.commentaires.length === 0" class="text-sm text-muted">
                        Aucun commentaire
                    </span>
                    <div v-else class="space-y-2">
                        <div v-for="com in props.candidature.commentaires" :key="com.id" class="p-2 border rounded">
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