<template>
  <div class="min-h-screen text-white flex flex-col">
    <!-- Header -->
    <h1
      class="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-500"
      :class="started ? 'mx-auto my-6 z-40 text-2xl' : 'mx-auto mt-[40vh]'"
    >
      WorkoutGPT
    </h1>

    <!-- Start Button -->
    <div v-if="!started" class="mx-auto mt-8">
      <button
        @click="start"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 rounded-full font-semibold text-white transition"
      >
        New Workout
      </button>
    </div>

    <!-- Form Wizard -->
     <Transition @enter="onStepShowEnter">
      <div v-if="showStep" class="flex flex-col justify-between min-h-[calc(100vh-6rem)] items-center px-4">
        <!-- Step Content -->
        <Transition name="progress" @leave="onProgressLeave">
          <div
            v-if="!generating"
            class="w-full max-w-2xl h-2 mb-4 rounded-full relative overflow-hidden"
            ref="progress"
          >
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div
              class="absolute top-0 right-0 h-full bg-[#2a2a2a] transition-all duration-1000"
              :style="{ width: `${100 - ((currentStep + 1) / steps.length) * 100}%` }"
            ></div>
          </div>
        </Transition>
        <Transition
          mode="out-in"
          @enter="onEnter"
          @leave="onLeave"
        >
          <div
            :key="currentStep"
            class="flex-1 flex items-center justify-center w-full max-w-2xl"
          >
            <component
              v-if="!generating"
              :is="steps[currentStep]"
              v-model:form="form"
            />
            <div v-else-if="generating && showLoader" ref="loader">
              <BlobLoader />
            </div>
          </div>
        </Transition>
      
        <!-- Bottom Nav Buttons -->
        <Transition
          name="buttons"
          @leave="onButtonsLeave"
        >
          <div
            v-if="!generating"
            class="flex justify-between my-6 w-full max-w-2xl"
            ref="buttons"
          >
            <button
              @click="prevStep"
              :disabled="currentStep === 0"
              :hidden="currentStep === 0"
              class="px-5 py-2 rounded-full font-medium transition text-[#a2a9b0] hover:bg-[#353739] disabled:opacity-50 disabled:hover:bg-transparent"
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
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import focusTargets from '~/data/focusTargets.js'
import equipmentOptions from '~/data/equipmentOptions.js'
import { submitFormToGemini } from '@/utils/submitForm.js'
import { useWorkoutStore } from '@/firebase/firebaseService'
import BlobLoader from '~/components/BlobLoader.vue'
import gsap from 'gsap'

import Step1 from '~/components/wizard/Step1FitnessGoal.vue'
import Step2 from '~/components/wizard/Step2FocusTargets.vue'
import Step3 from '~/components/wizard/Step3Equipment.vue'
import Step4 from '~/components/wizard/Step4Duration.vue'
import Step5 from '~/components/wizard/Step5ExperienceLevel.vue'
import Step6 from '~/components/wizard/Step6Notes.vue'

const store = useWorkoutStore()

const started = ref(false)
const showStep = ref(false)
const currentStep = ref(0)
const direction = ref('forward')
const steps = [Step1, Step2, Step3, Step4, Step5, Step6]
const progress = ref(null)
const buttons = ref(null)
const loader = ref(null)
const generating = ref(false)
const showLoader = ref(false)
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

const start = () => {
  started.value = true
  setTimeout(() => {
    showStep.value = true
  }, 400)
}

const nextStep = async () => {
  direction.value = 'forward'
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    try {
      generating.value = true

      const generated = await submitFormToGemini(form)
      const id = uuidv4()

      const workout = {
        ...generated,
        id,
        originalForm: { ...form }
      }

      store.setCurrentWorkout(workout)

      router.push({ path: `/workout/${id}`, query: { justGenerated: 'true' } })
    } catch (err) {
      generating.value = false
      console.error('Submit failed:', err)
    }
  }
}

const prevStep = () => {
  direction.value = 'backward'
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

const onStepShowEnter = (el) => {
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: 'power2.out' }
  )
}

const onEnter = (el) => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
      x: direction.value === 'forward' ? 100 : -100
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out'
    }
  )
}

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    x: direction.value === 'forward' ? -100 : 100,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}

const onButtonsLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: () => {
      showLoader.value = true
      done()
    }
  })
}

const onProgressLeave = (el, done) => {
  gsap.to(el, {
    scaleX: 0,
    transformOrigin: 'center center',
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: done
  })
}

watch(showLoader, async (val) => {
  if (val) {
    await nextTick()
    if (loader.value) {
      gsap.from(loader.value, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: 'power2.out'
      })
    }
  }
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

    if (primary && !form.equipment.includes('Bodyweight')) {
      form.equipment.unshift('Bodyweight')
    }
  },
  { immediate: true }
)
</script>
