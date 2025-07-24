<template>
  <div class="min-h-screen text-white flex flex-col">
    <!-- Header -->
    <h1
      class="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-500"
      :class="started ? 'mx-auto my-6 z-50 text-2xl' : 'mx-auto mt-[40vh]'"
    >
      WorkoutGPT
    </h1>

    <!-- Start Button -->
    <div v-if="!started" class="mx-auto mt-8">
      <button
        @click="started = true"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 rounded-full font-semibold text-white transition"
      >
        New Workout
      </button>
    </div>

    <!-- Form Wizard -->
    <div v-if="started" class="flex flex-col justify-between min-h-[calc(100vh-6rem)] items-center px-4">
      <!-- Step Content -->
      <div class="flex-1 flex items-center justify-center w-full max-w-2xl">
        <component :is="steps[currentStep]" v-model:form="form" />
      </div>

      <!-- Bottom Nav Buttons -->
      <div class="flex justify-between my-6 w-full max-w-2xl">
        <button
          @click="prevStep"
          :disabled="currentStep === 0"
          :hidden="currentStep === 0"
          class="px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50"
        >
          Previous
        </button>
        <div :hidden="currentStep !== 0"></div>
        <button
          @click="nextStep"
          :disabled="!canContinue"
          class="px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 text-white disabled:opacity-50 disabled:hover:brightness-100"
        >
          <span v-if="currentStep !== 5">Next</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import focusTargets from '~/data/focusTargets.js'
import equipmentOptions from '~/data/equipmentOptions.js'
import { submitFormToGemini } from '@/utils/submitForm.js'
import { useWorkoutStore } from '@/firebase/firebaseService'

import Step1 from '~/components/wizard/Step1FitnessGoal.vue'
import Step2 from '~/components/wizard/Step2FocusTargets.vue'
import Step3 from '~/components/wizard/Step3Equipment.vue'
import Step4 from '~/components/wizard/Step4Duration.vue'
import Step5 from '~/components/wizard/Step5ExperienceLevel.vue'
import Step6 from '~/components/wizard/Step6Notes.vue'

const started = ref(false)
const currentStep = ref(0)
const steps = [Step1, Step2, Step3, Step4, Step5, Step6]
const router = useRouter()

const form = reactive({
  primaryGoal: '',
  secondaryGoal: '',
  targets: [],
  equipment: ['Bodyweight'],
  duration: '',
  experience: '',
  notes: ''
})

const nextStep = async () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    try {
      const workout = await submitFormToGemini(form)

      const store = useWorkoutStore()
      store.setCurrentWorkout(workout)

      router.push('/workout')
    } catch (err) {
      console.error('Submit failed:', err)
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const canContinue = computed(() => {
  if (currentStep.value === 0) return !!form.primaryGoal
  else if (currentStep.value === 1) return form.targets.length > 0
  else if (currentStep.value === 2)  return form.equipment.length > 0
  else if (currentStep.value === 3)  return !!form.duration
  else if (currentStep.value === 4)  return !!form.experience
  return true
})

watch(
  () => [form.primaryGoal, form.secondaryGoal],
  ([primary, secondary]) => {
    const allowedTargets = new Set([
      ...(focusTargets[primary] || []),
      ...(focusTargets[secondary] || []),
    ])
    form.targets = form.targets.filter((target) => allowedTargets.has(target))

    const allowedEquipment = new Set([
      ...(equipmentOptions[primary] || []),
      ...(equipmentOptions[secondary] || []),
    ])
    form.equipment = form.equipment.filter((item) => allowedEquipment.has(item))

    if (primary) {
      form.equipment.unshift('Bodyweight')
    }
  },
  { immediate: true }
)
</script>
