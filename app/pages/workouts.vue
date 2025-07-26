<template>
  <div class="text-white py-6 px-0 sm:px-6 max-w-64 sm:max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">My Workouts</h1>
    <div v-if="isLoading">
      <div class="flex items-center justify-center mx-auto w-10 h-10 mt-20">
        <div class="h-6 w-6 border-2 border-[#a2a9b0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <div v-else-if="workouts.length">
      <ul class="space-y-4">
        <li
          v-for="workout in workouts"
          :key="workout.id"
          class="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 class="text-xl font-semibold">{{ workout.title }}</h2>
            <p class="text-sm text-gray-400 mt-1">
              Goals: {{ workout.originalForm.primaryGoal }}{{ workout.originalForm.secondaryGoal ? ", " + workout.originalForm.secondaryGoal : "" }} <br />
              Duration: {{ workout.originalForm.duration }} | Level: {{ workout.originalForm.experience }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Saved: {{ formatDate(workout.createdAt || workout.savedAt) }}
            </p>
          </div>

          <RouterLink
            :to="`/workout/${workout.id}`"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:brightness-110 transition"
          >
            View
          </RouterLink>
        </li>
      </ul>
    </div>

    <div v-else class="text-center text-gray-400 mt-20">
      No saved workouts yet. Create one from + New Workout.
    </div>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '@/firebase/firebaseService'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const store = useWorkoutStore()
const isLoading = ref(true)

onMounted(async () => {
  while (!store.user) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (store.user) await store.fetchWorkouts()
  isLoading.value = false
})

const workouts = computed(() =>
  [...store.workouts].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
)

console.log(workouts)

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>
