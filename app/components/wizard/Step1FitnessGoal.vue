<template>
  <div class="w-full space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-center">
        What is your
        <span class="text-blue-500">primary</span> and
        <span class="text-pink-500">secondary</span> fitness goal?
      </h2>
      <p class="text-center text-sm text-gray-400 mt-2">(Pick 1–2)</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="option in options"
        :key="option"
        @click="toggleGoal(option)"
        :disabled="!isSelected(option) && isMaxSelected"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition truncate',
          isSelected(option)
            ? selectedClass(option)
            : [
                'text-gray-300 border-gray-600',
                hoverBorderClass,
                (!isSelected(option) && isMaxSelected) ? 'opacity-50 cursor-not-allowed' : ''
              ]
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue'

const props = defineProps({
  form: Object,
})

const options = [
  'Strength',
  'Cardiovascular',
  'Flexibility',
  'Mobility',
  'Balance',
  'Weight Loss'
]

const { form } = toRefs(props)

const toggleGoal = (goal) => {
  if (form.value.primaryGoal === goal) {
    form.value.primaryGoal = form.value.secondaryGoal
    form.value.secondaryGoal = ''
  } else if (form.value.secondaryGoal === goal) {
    form.value.secondaryGoal = ''
  } else if (!form.value.primaryGoal) {
    form.value.primaryGoal = goal
  } else if (!form.value.secondaryGoal) {
    form.value.secondaryGoal = goal
  }
}

const isSelected = (goal) => {
  return form.value.primaryGoal === goal || form.value.secondaryGoal === goal
}

const isMaxSelected = computed(() => {
  return !!form.value.primaryGoal && !!form.value.secondaryGoal
})

const hoverBorderClass = computed(() => {
  if (!form.value.primaryGoal) return 'hover:border-blue-500 hover:text-white'
  if (!form.value.secondaryGoal) return 'hover:border-pink-500 hover:text-white'
  return ''
})

const selectedClass = (goal) => {
  if (form.value.primaryGoal === goal) return 'bg-blue-500 text-white border-blue-500'
  if (form.value.secondaryGoal === goal) return 'bg-pink-500 text-white border-pink-500'
  return ''
}
</script>
