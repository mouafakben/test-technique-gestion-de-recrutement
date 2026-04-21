<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
const open = ref(false)

const links = [[
    { label: 'candidatures', icon: 'i-lucide-house', to: '/candidatures', onSelect: () => (open.value = false) },
    { label: 'postes', icon: 'i-lucide-book-open', to: '/postes', onSelect: () => (open.value = false) },
]] satisfies NavigationMenuItem[][]

</script>
<template>
    <div>
        <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
            :ui="{ footer: 'lg:border-t lg:border-default' }">
            <template #header="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
                <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip
                    class="mt-auto" />
            </template>
        </UDashboardSidebar>
    </div>
</template>


<style></style>