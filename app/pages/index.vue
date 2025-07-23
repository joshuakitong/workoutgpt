<template>
  <div class="min-h-screen bg-[#1b1c1d] text-white relative">
    <h1
      class="title font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-500"
      :class="titleClass"
    >
      WorkoutGPT
    </h1>

    <div
      v-if="!started"
      class="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <button
        @click="started = true"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 rounded-full text-white transition"
      >
        Generate Workout
      </button>
    </div>

    <div v-if="started" class="max-w-2xl mx-auto pt-32 px-4">
      <component
        :is="steps[currentStep]"
        @next="nextStep"
        @prev="prevStep"
        v-model:form="form"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

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
  equipment: [],
  days: [],
  singleDayOnly: false,
  duration: '',
  experience: '',
  notes: '',
})

const titleClass = computed(() =>
  started.value
    ? 'absolute top-5 left-5 text-xl z-50'
    : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl'
)

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}
</script>