<template>
  <aside
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    :class="[
      'sticky top-0 min-h-[calc(100vh+6rem)] bg-[#282a2c] text-white transition-all duration-300 z-50',
      isExpanded ? 'w-72' : 'w-16'
    ]"
  >
    <!-- Hamburger Icon -->
    <div class="flex items-center justify-between px-2 py-3">
      <button
        @click="toggleLock"
        class="p-3 rounded-full hover:bg-[#353739] active:bg-[#4c4e4f] transition-colors duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-[#babdbc]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <nav class="mt-2 flex flex-col px-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 p-3 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
        exact-active-class="text-blue-500 cursor-default"
      >
        <!-- Plus Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span
          class="text-md font-semibold truncate transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
        >
          New Workout
        </span>
      </NuxtLink>

      <NuxtLink
        to="/workouts"
        class="flex items-center gap-3 p-3 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
        active-class="text-blue-500 cursor-default"
      >
        <!-- Heart Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 shrink-0 transition-opacity duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
        <span
          class="text-md font-semibold truncate transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
        >
          Generated Workouts
        </span>
      </NuxtLink>
    </nav>
    
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const hovering = ref(false)
const lockedOpen = ref(false)

const toggleLock = () => {
  lockedOpen.value = !lockedOpen.value
  hovering.value = false
}

const isExpanded = computed(() => hovering.value || lockedOpen.value)
</script>
