<template>
  <div class="min-h-screen text-white flex flex-col">
    <!-- Header -->
    <h1
      class="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-500"
      :class="started ? 'mx-auto mt-6 z-50 text-2xl' : 'mx-auto mt-[40vh]'"
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
    <div v-if="started" class="flex flex-col justify-between min-h-[calc(100vh-6rem)] max-w-2xl mx-auto px-4">
      <!-- Step Content -->
      <div class="flex-1 flex items-center justify-center">
        <div class="w-full">
          <component :is="steps[currentStep]" v-model:form="form" />
        </div>
      </div>

      <!-- Bottom Nav Buttons -->
      <div class="flex justify-between mt-6">
        <button
          @click="prevStep"
          :disabled="currentStep === 0"
          :hidden="currentStep === 0"
          class="px-5 py-2 rounded-full font-medium transition border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <div :hidden="currentStep !== 0"></div>
        <button
          @click="nextStep"
          :disabled="!canContinue"
          class="px-5 py-2 rounded-full font-medium transition bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 text-white disabled:opacity-50 disabled:hover:brightness-100"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import Step1 from '@/components/wizard/Step1.vue'
import Step2 from '@/components/wizard/Step2.vue'
import Step3 from '@/components/wizard/Step3.vue'
import Step4 from '@/components/wizard/Step4.vue'
import Step5 from '@/components/wizard/Step5.vue'
import Step6 from '@/components/wizard/Step6.vue'

useHead({ title: 'WorkoutGPT' })

const started = ref(false)
const currentStep = ref(0)
const steps = [Step1, Step2, Step3, Step4, Step5, Step6]

const form = reactive({
  primaryGoal: '',
  secondaryGoal: '',
  focus: '',
  equipment: [],
  duration: '',
  experience: '',
  notes: '',
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const canContinue = computed(() => {
  if (currentStep.value === 0) return !!form.primaryGoal
  return true
})
</script>
