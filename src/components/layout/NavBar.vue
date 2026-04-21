<script lang="ts" setup></script>
<template>
    <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
            <UDashboardSidebarCollapse />
        </template>

        <template #right>
            <UColorModeButton />
        </template>
    </UDashboardNavbar>
</template>