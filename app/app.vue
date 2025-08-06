<template>
  <div class="flex bg-[#1b1c1d] text-white min-h-screen">
    <Sidebar />
    <main class="flex-1 ml-16">
      <NuxtPage :page-transition="pageTransition" />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
useHead({ title: 'WorkoutGPT' })
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(2px);
}
</style>