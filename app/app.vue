<template>
  <div class="flex bg-[#1b1c1d] text-white min-h-screen">
    <Sidebar />
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
</script>