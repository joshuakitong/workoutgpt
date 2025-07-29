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
      <!-- Section 1: Title -->
      <div ref="titleSection" v-show="!animating || showTitle || regenerating" class="flex items-center justify-between w-full gap-2">
        <h1 v-if="!isRenaming" class="text-3xl font-bold mb-1">{{ workout.title }}</h1>
        <div
          v-else
          class="flex flex-col sm:flex-row sm:items-center gap-2 w-full"
        >
          <input
            v-model="editTitle"
            :disabled="regenerating"
            class="w-full sm:flex-1 max-w-sm bg-[#1e1e1e] rounded-full border border-gray-600 focus:outline-none focus:border-blue-500 px-4 py-1 text-white text-xl"
          />
          <div class="flex gap-2">
            <button
              @click="saveTitle"
              :disabled="regenerating"
              class="text-sm px-5 py-2 rounded-full bg-blue-500 text-white text-center hover:brightness-110 disabled:opacity-50 disabled:brightness-100"
            >
              Save
            </button>
            <button
              @click="cancelRename"
              :disabled="regenerating"
              class="text-sm px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50 disabled:bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>

        <div class="ml-auto">
          <WorkoutOptionsMenu
            v-show="isSavedWorkout && !animating && !isRenaming"
            :disabled="regenerating"
            :workout="workout"
            @startRename="startRename"
            @confirmDelete="openDeleteModal"
          />
        </div>
      </div>

      <!-- Section 2: Details -->
      <div ref="detailsSection" v-show="!animating || showDetails || regenerating">
        <p class="text-sm text-gray-400 mt-4">
          Goals: {{ workout.originalForm.primaryGoal }}{{ workout.originalForm.secondaryGoal ? ", " + workout.originalForm.secondaryGoal : "" }} | Duration: {{ workout.originalForm.duration }} | Level: {{ workout.originalForm.experience }}
        </p>

        <p class="text-sm text-gray-400 mt-4">
          Targets: {{ workout.originalForm.targets.join(', ') }}
        </p>

        <p class="text-sm text-gray-400 my-4">
          Equipment: {{ workout.originalForm.equipment.join(', ') }}
        </p>

        <p v-if="workout.originalForm.notes" class="text-sm text-gray-400 my-4">
          User Notes: {{ workout.originalForm.notes }}
        </p>
      </div>

      <div v-if="regenerating" class="flex justify-center my-10">
        <BlobLoader />
      </div>

      <template v-else>
        <!-- Section 3: Exercises -->
        <div v-for="(segment, sIndex) in workout.segments" :key="segment.title" class="mb-8">
          <h2
            v-show="!animating || shownSegmentTitles.includes(sIndex)"
            class="text-xl font-semibold mb-2"
            :ref="el => setSegmentTitleRef(el, sIndex)"
          >
            {{ segment.title }}
            <span class="text-gray-300 text-md">({{ segment.duration }})</span>
          </h2>
          <ul class="space-y-4">
            <li
              v-for="(exercise, eIndex) in segment.exercises"
              :key="`${sIndex}-${eIndex}`"
              v-show="!animating || shownExercises.includes(`${sIndex}-${eIndex}`)"
              :ref="el => setExerciseRefs(el, sIndex, eIndex)"
              class="relative bg-[#1e1e1e] p-4 rounded-xl border border-white/10 hover:border-white/30"
            >
              <div class="flex justify-between mb-1">
                <h3 class="text-lg font-semibold">{{ exercise.name }}</h3>
                <span class="text-sm text-gray-400 text-right">{{ exercise.reps }}</span>
              </div>
              <p class="text-sm text-gray-300 mb-2">{{ exercise.description }}</p>
              <p class="text-xs text-gray-400 whitespace-pre-line">{{ exercise.instructions }}</p>
              <a
                :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}+exercise`"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute bottom-3 right-3"
                title="Search on YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-4" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="16" fill="#FF0000" />
                  <path d="M19 10L32 16L19 22V10Z" fill="white" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section 4: Notes -->
        <div v-if="workout.notes" ref="notesSection" v-show="!animating || showNotes" class="mt-10">
          <h3 class="text-lg font-semibold mb-2">WorkoutGPT Notes</h3>
          <p class="text-sm text-gray-300">{{ workout.notes }}</p>
        </div>
      </template>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4 max-w-2xl ml-auto w-full"  ref="buttonsSection" v-show="!animating || showButtons">
        <button
          @click="discardWorkout"
          v-if="!isSavedWorkout"
          :disabled="regenerating"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50 disabled:bg-transparent"
        >
          Discard
        </button>

        <button
          @click="regenerateWorkout"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:brightness-110 text-white disabled:opacity-50 disabled:hover:brightness-100"
          :disabled="regenerating"
        >
          {{ regenerating ? 'Regenerating...' : 'Regenerate' }}
        </button>

        <button
          @click="saveWorkout"
          :disabled="!(justGenerated || isLocalNewerThanBackend) || regenerating || !store.user"
          class="w-full sm:w-auto px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 disabled:hover:brightness-100 text-white disabled:opacity-50"
        >
          {{store.user ? "Save" : "Sign in to Save"}}
        </button>
      </div>
    </div>

    <div v-else>
      <p class="text-gray-400 text-center mt-20">No workout found. Please create one from + New Workout.</p>
    </div>

    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :workout="workout"
      @cancel="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutStore } from '@/firebase/firebaseService'
import { onMounted, ref, computed, nextTick } from 'vue'
import { submitFormToGemini } from '@/utils/submitForm'
import gsap from 'gsap'
import WorkoutOptionsMenu from '@/components/workout/workoutOptionsMenu.vue'
import DeleteConfirmationModal from '@/components/workout/deleteConfirmationModal.vue'
import SkeletonBox from '@/components/SkeletonBox.vue'
import BlobLoader from '@/components/BlobLoader.vue'

const route = useRoute()
const router = useRouter()
const workoutId = route.params.id
const justGenerated = computed(() => route.query.justGenerated === 'true')
const animating = computed(() => justGenerated.value || hasRegenerated.value)
const store = useWorkoutStore()
const workout = ref(null)
const regenerating = ref(false)
const hasRegenerated = ref(false)
const isSavedWorkout = ref(false)
const isLoading = ref(true)
const showDeleteModal = ref(false)
const isRenaming = ref(false)
const editTitle = ref('')

const titleSection = ref(null)
const detailsSection = ref(null)
const notesSection = ref(null)
const buttonsSection = ref(null)
const segmentTitleRefs = ref([])
const exerciseRefs = ref([])
const exerciseItems = []
const showTitle = ref(false)
const showDetails = ref(false)
const shownSegmentTitles = ref([])
const shownExercises = ref([])
const showNotes = ref(false)
const showButtons = ref(false)
const skipTitleAndDetails = ref(false)

onMounted(async () => {
  store.initializeStore()
  if (store.user && store.workouts.length === 0) await store.fetchWorkouts()

  const stored = store.workouts.find(w => w.id === workoutId)
  if (stored) {
    workout.value = stored
    store.setCurrentWorkout(stored)
    isSavedWorkout.value = true
  } else if (store.currentWorkout?.id === workoutId) {
    workout.value = store.currentWorkout
  }

  isLoading.value = false

  if (justGenerated.value) {
    await nextTick()
    animateSections()
  }
})

watchEffect(() => {
  if (workout.value && store.user && store.workouts.length > 0) {
    isSavedWorkout.value = store.workouts.some(w => w.id === workout.value.id)
  }
})

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const animateSections = async () => {
  if (!skipTitleAndDetails.value) {
    showTitle.value = true
    await gsap.from(titleSection.value, { opacity: 0, y: 20, duration: 0.5 })
    showDetails.value = true
    await gsap.from(detailsSection.value, { opacity: 0, y: 20, duration: 0.5 })
    await wait(50)
  } else {
    showTitle.value = true
    showDetails.value = true
  }

  for (let s = 0; s < segmentTitleRefs.value.length; s++) {
    const segmentTitle = segmentTitleRefs.value[s]
    if (segmentTitle) {
      shownSegmentTitles.value.push(s)
      await nextTick()
      segmentTitle.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await gsap.from(segmentTitle, { opacity: 0, y: 20, duration: 0.5 })
      
      await wait(50)
    }

    for (let e = 0; e < workout.value.segments[s].exercises.length; e++) {
      const key = `${s}-${e}`
      shownExercises.value.push(key)
      await nextTick()
      const refItem = exerciseRefs.value.find(item => item.key === key)
      if (refItem?.el) {
        refItem.el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        await gsap.from(refItem.el, { opacity: 0, y: 20, duration: 0.5 })
        await wait(50)
      }
    }
  }

  showNotes.value = true
  await nextTick()
  notesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await gsap.from(notesSection.value, { opacity: 0, y: 20, duration: 0.5 })
  
  await wait(50)

  showButtons.value = true
  await nextTick()
  buttonsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await gsap.from(buttonsSection.value, { opacity: 0, y: 20, duration: 0.5 })
  
}

const setSegmentTitleRef = (el, index) => {
  if (el) {
    segmentTitleRefs.value[index] = el
  }
}

onUpdated(() => {
  if (justGenerated.value) {
    exerciseItems.length = 0
    exerciseRefs.value.forEach(({ el }) => {
      if (el) exerciseItems.push(el)
    })
  }
})

const setExerciseRefs = (el, sIndex, eIndex) => {
  if (!el) return
  const key = `${sIndex}-${eIndex}`
  if (!exerciseRefs.value.find(ref => ref.key === key)) {
    exerciseRefs.value.push({ el, key })
  }
}

const regenerateWorkout = async () => {
  isRenaming.value = false
  editTitle.value = ''

  if (!workout.value?.originalForm) return

  regenerating.value = true
  showTitle.value = true
  showDetails.value = true
  exerciseItems.length = 0
  segmentTitleRefs.value = []
  shownSegmentTitles.value = []
  exerciseRefs.value = []
  shownExercises.value = []
  showNotes.value = false

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

    regenerating.value = false
    skipTitleAndDetails.value = true
    buttonsSection.value = []
    showButtons.value = false
    await nextTick()
    animateSections()

  } catch (err) {
    regenerating.value = false
    console.error('Regeneration error:', err)
  }
}

const discardWorkout = () => {
  router.push('/')
}

const saveWorkout = async () => {
  if (!workout.value) return
  const updatedWorkout = {
    ...workout.value,
    savedAt: new Date().toISOString()
  }

  await store.saveWorkout(updatedWorkout)
  store.setCurrentWorkout(updatedWorkout)
  router.push('/workouts')
}

const startRename = () => {
  isRenaming.value = true
  editTitle.value = workout.value.title
}

const cancelRename = () => {
  isRenaming.value = false
  editTitle.value = ''
}

const saveTitle = async () => {
  if (!editTitle.value.trim()) return
  workout.value.title = editTitle.value.trim()
  isRenaming.value = false
  await store.saveWorkout(workout.value)
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (!workout.value) return

  store.deleteWorkout(workout.value.id)
  router.push('/workouts')
}

const isLocalNewerThanBackend = computed(() => {
  const backendWorkout = store.workouts.find(w => w.id === workoutId)
  if (!backendWorkout || !workout.value) return false

  const localDate = new Date(workout.value.savedAt)
  const backendDate = new Date(backendWorkout.savedAt)

  return localDate > backendDate
})
</script>
