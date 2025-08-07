<template>
  <aside
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    :class="[
      'fixed top-0 min-h-screen bg-[#282a2c] text-white transition-all duration-300 z-50',
      isExpanded ? 'w-72' : 'w-16',
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

    <nav class="mt-2 flex flex-col px-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 py-3 px-2 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
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
        class="flex items-center gap-3 py-3 px-2 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
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
          class="px-3 text-xs font-semibold text-[#a2a9b0] uppercase tracking-wide transition-opacity duration-300"
          :class="{ 'opacity-0': !isExpanded }"
        >
          Recent
        </p>
        <div v-if="isLoading && store.userLoading">
          <div class="flex items-center justify-center mx-auto w-10 h-10">
            <div class="h-4 w-4 border-2 border-[#a2a9b0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <div v-else-if="store.user">
          <NuxtLink
            v-for="w in workouts"
            :key="w.id"
            :to="`/workout/${w.id}`"
            class="flex items-center gap-3 py-3 px-2 rounded-full text-[#a2a9b0] hover:text-blue-500 transition"
            :class="{ 'text-blue-500 cursor-default': isWorkoutActive(w.id) }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <div v-else
          class="mt-4 mx-auto py-4 px-6 w-full rounded-xl bg-[#353739] transition-all"
          :class="{
            'opacity-100 delay-200 duration-300': isExpanded,
            'opacity-0 delay-0 duration-50': !isExpanded
          }"
        >
          <p class="text-sm text-[#a2a9b0] mb-2">
            Sign in to start saving your workouts.<br />
            Once you're signed in, you can access your recent workouts here.
          </p>
          <button
            @click="signIn"
            class="text-sm mt-2 button text-blue-500 hover:bg-[#ddd] hover:bg-[#353739]"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  </aside>

  <div class="fixed bottom-3 left-3 md:top-3 md:right-3 md:bottom-auto md:left-auto z-50">
    <div v-if="store.userLoading" class="flex items-center justify-center w-10 h-10">
      <div class="h-4 w-4 border-2 border-[#a2a9b0] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <button
      v-else-if="!store.user"
      @click="signIn"
      class="hidden sm:block button bg-blue-500 hover:brightness-110 text-white text-sm shadow"
    >
      Sign In
    </button>

    <div v-else class="relative group">
      <button class="w-10 h-10 rounded-full overflow-hidden">
        <img
          v-if="store.user.photoURL"
          :src="store.user.photoURL"
          alt="User profile"
          class="w-full h-full object-cover"
        />
      </button>
      <div
        class="absolute -top-12 -right-10 sm:top-auto sm:right-0 button bg-[#353739] border border-white/10 shadow-md text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 hover:brightness-110 duration-200 z-50"
      >
        <button @click="signOut" class="text-left">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkoutStore } from '@/firebase/firebaseService'
import { useAuth } from '@/composables/useAuth'

const { signIn, signOut } = useAuth()
const hovering = ref(false)
const lockedOpen = ref(false)
const isLoading = ref(true)
const isExpanded = computed(() => hovering.value || lockedOpen.value)
const toggleLock = () => {
  lockedOpen.value = !lockedOpen.value
  hovering.value = false
}

const store = useWorkoutStore()
const route = useRoute()

onMounted(async () => {
  while (!store.user) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (store.user) await store.fetchWorkouts()
  isLoading.value = false
})

const workouts = computed(() =>
  [...store.workouts].sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)).slice(0, 10)
)

const isWorkoutActive = (id) => route.path === `/workout/${id}`
</script>
