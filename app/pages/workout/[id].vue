<template>
  <div class="text-white py-6 px-1 sm:px-6 max-w-60 sm:max-w-3xl mx-auto">
    <div v-if="workout">
      <h1 class="text-3xl font-bold mb-1">{{ workout.title }}</h1>
      <p class="text-sm text-gray-400 mt-4">
        Goals: {{ workout.goals.join(', ') }} | Duration: {{ workout.duration }} | Level: {{ workout.experience }}
      </p>

      <p class="text-sm text-gray-400 mt-4">
        Targets: {{ workout.targets.join(', ') }}
      </p>

      <p class="text-sm text-gray-400 my-4">
        Equipment: {{ workout.equipment.join(', ') }}
      </p>

      <div v-for="segment in workout.segments" :key="segment.title" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">{{ segment.title }} <span class="text-gray-300 text-md">({{ segment.duration }})</span></h2>
        <ul class="space-y-4">
          <li
            v-for="exercise in segment.exercises"
            :key="exercise.name"
            class="bg-[#1e1e1e] p-4 rounded-xl border border-white/10"
          >
            <div class="flex justify-between mb-1">
              <h3 class="text-lg font-semibold">{{ exercise.name }}</h3>
              <span class="text-sm text-gray-400 text-right">{{ exercise.reps }}</span>
            </div>
            <p class="text-sm text-gray-300 mb-2">{{ exercise.description }}</p>
            <p class="text-xs text-gray-400 whitespace-pre-line">{{ exercise.instructions }}</p>
          </li>
        </ul>
      </div>

      <div v-if="workout.notes" class="mt-10">
        <h3 class="text-lg font-semibold mb-2">Notes</h3>
        <p class="text-sm text-gray-300">{{ workout.notes }}</p>
      </div>
    </div>

    <div
      v-if="workout && (isSavedWorkout)"
      class="mt-12 flex justify-end gap-4 max-w-2xl ml-auto"
    >
      <button
        @click="discardWorkout"
        v-if="!isSavedWorkout"
        class="px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50"
      >
        Discard
      </button>

      <button
        @click="deleteWorkout"
        v-if="isSavedWorkout"
        class="px-5 py-2 rounded-full font-medium transition text-red-400 hover:bg-red-500 hover:text-white"
      >
        Delete
      </button>

      <button
        @click="regenerateWorkout"
        class="px-5 py-2 rounded-full font-medium transition bg-yellow-500 hover:brightness-110 text-black disabled:opacity-50"
        :disabled="regenerating"
      >
        {{ regenerating ? 'Regenerating...' : 'Regenerate' }}
      </button>

      <button
        @click="saveWorkout"
        :disabled="(!isSavedWorkout || !hasRegenerated)"
        class="px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 disabled:hover:brightness-100 text-white disabled:opacity-50"
      >
        Save
      </button>
    </div>


    <div v-else>
      <p class="text-gray-400 text-center mt-20">No workout found. Please create one from the form first.</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutStore } from '@/firebase/firebaseService'
import { onMounted, ref, watch } from 'vue'
import { submitFormToGemini } from '@/utils/submitForm'

const route = useRoute()
const router = useRouter()
const workoutId = route.params.id

const store = useWorkoutStore()
const workout = ref(null)
const regenerating = ref(false)
const hasRegenerated = ref(false)
const isSavedWorkout = ref(false)

onMounted(() => {
  const stored = store.workouts?.find(w => w.id === workoutId)

  if (stored) {
    workout.value = stored
    store.setCurrentWorkout(stored)
    isSavedWorkout.value = true
  } else if (store.currentWorkout?.id === workoutId) {
    workout.value = store.currentWorkout
    isSavedWorkout.value = false
  } else {
    router.replace('/')
  }
})

const regenerateWorkout = async () => {
  if (!workout.value?.originalForm) return
  regenerating.value = true
  try {
    const regenerated = await submitFormToGemini(workout.value.originalForm)
    const updated = {
      ...regenerated,
      originalForm: workout.value.originalForm,
      id: workoutId
    }
    workout.value = updated
    store.setCurrentWorkout(updated)
    hasRegenerated.value = true
  } catch (err) {
    alert('Regeneration failed.')
    console.error('Regeneration error:', err)
  } finally {
    regenerating.value = false
  }
}

const saveWorkout = () => {
  if (!workout.value) return

  const exists = store.workouts.find(w => w.id === workout.value.id)
  if (!exists) {
    store.addWorkout({ ...workout.value, savedAt: new Date().toISOString() })
  }
  store.setCurrentWorkout(workout.value)
  alert('Workout saved!')
}

const deleteWorkout = () => {
  if (!workout.value) return

  store.deleteWorkout(workout.value.id)
  alert('Workout deleted.')
  router.push('/workouts')
}
</script>


