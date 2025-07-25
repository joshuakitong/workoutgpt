<template>
  <aside
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    :class="[
      'sticky top-0 min-h-screen bg-[#282a2c] text-white transition-all duration-300 z-50',
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
          My Workouts
        </span>
      </NuxtLink>
      <div class="mt-4">
        <p
          class="px-3 text-xs font-semibold text-[#777] uppercase tracking-wide"
          :class="{ 'opacity-0': !isExpanded }"
        >
          Recent
        </p>

        <NuxtLink
          v-for="w in workouts"
          :key="w.id"
          :to="`/workout/${w.id}`"
          class="flex items-center gap-3 p-3 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
          :class="{ 'text-blue-500 cursor-default': isWorkoutActive(w.id) }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span
            class="text-sm truncate transition-opacity duration-300"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >
            {{ w.title || 'Untitled' }}
          </span>
        </NuxtLink>
      </div>
    </nav>
    
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWorkoutStore } from '@/firebase/firebaseService'
import { useRoute } from 'vue-router'

const hovering = ref(false)
const lockedOpen = ref(false)
const isExpanded = computed(() => hovering.value || lockedOpen.value)
const toggleLock = () => {
  lockedOpen.value = !lockedOpen.value
  hovering.value = false
}

const store = useWorkoutStore()
const route = useRoute()

onMounted(() => {
  store.initializeStore()
})

const workouts = computed(() =>
  [...store.workouts].sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)).slice(0, 5)
)

const isWorkoutActive = (id) => route.path === `/workout/${id}`
</script>
