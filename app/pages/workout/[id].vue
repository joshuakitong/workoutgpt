<template>
  <div class="text-white py-6 px-0 sm:px-6 max-w-64 sm:max-w-2xl mx-auto">
    <div v-if="isLoading" class="space-y-4">
      <SkeletonBox height="h-10" width="w-full" rounded="rounded-md" />
      <SkeletonBox height="h-4" width="w-4/5" rounded="rounded-md" />
      <SkeletonBox height="h-4" width="w-1/2" rounded="rounded-md" />
      <SkeletonBox height="h-4" width="w-1/3" rounded="rounded-md" />
      <SkeletonBox height="h-4" width="w-2/3" rounded="rounded-md" />
      <SkeletonBox height="h-32" width="w-full" rounded="rounded-xl" />
      <SkeletonBox height="h-32" width="w-full" rounded="rounded-xl" />
      <SkeletonBox height="h-32" width="w-full" rounded="rounded-xl" />
    </div>
    
    <div v-else-if="workout">
      <h1 class="text-3xl font-bold mb-1">{{ workout.title }}</h1>
      <p class="text-sm text-gray-400 mt-4">
        Goals: {{ workout.originalForm.primaryGoal }}{{ workout.originalForm.secondaryGoal ? ", " + workout.originalForm.secondaryGoal : "" }} | Duration: {{ workout.originalForm.duration }} | Level: {{ workout.originalForm.experience }}
      </p>

      <p class="text-sm text-gray-400 mt-4">
        Targets: {{ workout.originalForm.targets.join(', ') }}
      </p>

      <p class="text-sm text-gray-400 my-4">
        Equipment: {{ workout.originalForm.equipment.join(', ') }}
      </p>

      <p class="text-sm text-gray-400 my-4">
        User Notes: {{ workout.originalForm.notes }}
      </p>

      <div v-for="segment in workout.segments" :key="segment.title" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">{{ segment.title }} <span class="text-gray-300 text-md">({{ segment.duration }})</span></h2>
        <ul class="space-y-4">
          <li
            v-for="exercise in segment.exercises"
            :key="exercise.name"
            class="relative bg-[#1e1e1e] p-4 rounded-xl border border-white/10 hover:border-white/50 transition-all duration-300"
          >
            <div class="flex justify-between mb-1">
              <h3 class="text-lg font-semibold">{{ exercise.name }}</h3>
              <span class="text-sm text-gray-400 text-right">{{ exercise.reps }}</span>
            </div>
            <p class="text-sm text-gray-300 mb-2">{{ exercise.description }}</p>
            <p class="text-xs text-gray-400 whitespace-pre-line">{{ exercise.instructions }}</p>
            <!-- YouTube Icon Button -->
            <a
              :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}+exercise`"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-3 right-3"
              title="Search on YouTube"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="16" fill="#FF0000" />

                <path
                  d="M19 10L32 16L19 22V10Z"
                  fill="white"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div v-if="workout.notes" class="mt-10">
        <h3 class="text-lg font-semibold mb-2">WorkoutGPT Notes</h3>
        <p class="text-sm text-gray-300">{{ workout.notes }}</p>
      </div>
    
      <div class="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4 max-w-2xl ml-auto w-full">
        <button
          @click="discardWorkout"
          v-if="!isSavedWorkout"
          :disabled="regenerating"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50 disabled:bg-transparent"
        >
          Discard
        </button>

        <button
          @click="showDeleteModal = true"
          v-if="isSavedWorkout"
          :disabled="regenerating"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-400"
        >
          Delete
        </button>

        <button
          @click="regenerateWorkout"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition bg-yellow-500 hover:brightness-110 text-black disabled:opacity-50 disabled:hover:brightness-100"
          :disabled="regenerating"
        >
          {{ regenerating ? 'Regenerating...' : 'Regenerate' }}
        </button>

        <button
          @click="saveWorkout"
          :disabled="!(justGenerated || hasRegenerated) || regenerating || !store.user"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 disabled:hover:brightness-100 text-white disabled:opacity-50"
        >
          {{store.user ? "Save" : "Sign in to Save"}}
        </button><br />
      </div>
    </div>

    <div v-else>
      <p class="text-gray-400 text-center mt-20">No workout found. Please create one from + New Workout.</p>
    </div>
  </div>

  <DeleteConfirmationModal
    v-if="showDeleteModal"
    @cancel="showDeleteModal = false"
    @confirm="confirmDeleteWorkout"
  />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutStore } from '@/firebase/firebaseService'
import { onMounted, ref } from 'vue'
import { submitFormToGemini } from '@/utils/submitForm'
import DeleteConfirmationModal from '~/components/workout/deleteConfirmationModal.vue'
import SkeletonBox from '@/components/SkeletonBox.vue'

const route = useRoute()
const router = useRouter()
const workoutId = route.params.id
const justGenerated = computed(() => route.query.justGenerated === 'true')
const store = useWorkoutStore()
const workout = ref(null)
const regenerating = ref(false)
const hasRegenerated = ref(false)
const isSavedWorkout = ref(false)
const isLoading = ref(true)
const showDeleteModal = ref(false)

onMounted(async () => {
  store.initializeStore()

  if (store.user && store.workouts.length === 0) {
    await store.fetchWorkouts()
  }

  const stored = store.workouts.find(w => w.id === workoutId)

  if (stored) {
    workout.value = stored
    store.setCurrentWorkout(stored)
    isSavedWorkout.value = true
  } else if (store.currentWorkout?.id === workoutId) {
    workout.value = store.currentWorkout
    isSavedWorkout.value = false
  }

  isLoading.value = false
})

const regenerateWorkout = async () => {
  if (!workout.value?.originalForm) return

  regenerating.value = true

  try {
    const regenerated = await submitFormToGemini(workout.value.originalForm)

    const updated = {
      ...regenerated,
      id: workoutId,
      originalForm: workout.value.originalForm,
      title: workout.value.title,
      savedAt: new Date().toISOString()
    }

    workout.value = updated
    store.setCurrentWorkout(updated)
    hasRegenerated.value = true

  } catch (err) {
    console.error('Regeneration error:', err)
  } finally {
    regenerating.value = false
  }
}

const discardWorkout = () => {
  router.push('/')
}

const saveWorkout = async () => {
  if (!workout.value) return
  console.log(workout.value)
  const updatedWorkout = {
    ...workout.value,
    savedAt: new Date().toISOString()
  }

  await store.saveWorkout(updatedWorkout)
  store.setCurrentWorkout(updatedWorkout)
  router.push('/workouts')
}

const confirmDeleteWorkout = () => {
  if (!workout.value) return

  store.deleteWorkout(workout.value.id)
  router.push('/workouts')
}
</script>
