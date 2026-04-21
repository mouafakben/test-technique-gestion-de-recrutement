<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Poste } from '@/types/poste'
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import { usePosteStore } from '@/stores/posteStore'

const posteStore = usePosteStore()

onMounted(() => {
  posteStore.getPostes()
})

const data = computed<Poste[]>(() => posteStore.postes)

const columns: TableColumn<Poste>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'titre',
    header: 'Titre',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'competencesRequises',
    header: 'Compétences requises',
    cell: ({ row }) => {
      const competences: string[] = row.getValue('competencesRequises')
      return h(
        'div',
        { class: 'flex flex-wrap gap-1' },
        competences.map((c) => h(resolveComponent('UBadge'), { label: c, variant: 'subtle' })),
      )
    },
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <UTable
      :data="data"
      :columns="columns"
      :loading="posteStore.loading"
      caption="Liste des postes"
      class="flex-1"
    />
  </div>
</template>
