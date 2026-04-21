<!-- layouts/dashboard.vue -->
<script setup lang="ts">
import SideBar from '@/components/layout/SideBar.vue'
import NavBar from '@/components/layout/NavBar.vue'
import type router from '@/router'
</script>
<template>
  <UDashboardGroup unit="rem">
    <SideBar />
    <!-- Main Panel (Shared Navbar + Toolbar) -->
    <UDashboardPanel id="main">
      <template #header>
        <NavBar />
      </template>

      <!-- Page Body Slot -->
      <template #body>
        <router-view />
      </template>
    </UDashboardPanel>

    <!-- <NotificationsSlideover /> -->
  </UDashboardGroup>
</template>
