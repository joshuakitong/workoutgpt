<template>
  <div class="text-white p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">My Workouts</h1>

    <div v-if="workouts.length">
      <ul class="space-y-4">
        <li
          v-for="w in workouts"
          :key="w.id"
          class="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 class="text-xl font-semibold">{{ w.title }}</h2>
            <p class="text-sm text-gray-400 mt-1">
              Goals: {{ w.goals?.join(', ') || w.primaryGoal }} <br />
              Duration: {{ w.duration }} | Level: {{ w.experience }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Saved: {{ formatDate(w.createdAt || w.savedAt) }}
            </p>
          </div>

          <RouterLink
            :to="`/workout/${w.id}`"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:brightness-110 transition"
          >
            View
          </RouterLink>
        </li>
      </ul>
    </div>

    <div v-else class="text-center text-gray-400 mt-20">
      No saved workouts yet. Go to the home page to generate one!
    </div>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '@/firebase/firebaseService'
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const store = useWorkoutStore()

onMounted(() => {
  store.initializeStore()
})

const workouts = computed(() =>
  [...store.workouts].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
)

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleString()
}
</script>
