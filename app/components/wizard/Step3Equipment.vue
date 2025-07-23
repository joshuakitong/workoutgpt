<template>
  <div class="w-full max-w-2xl space-y-8 mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-center">What equipment do you have access to?</h2>
      <p class="text-center text-sm text-[#a2a9b0] mt-2">(Select all that apply)</p>
    </div>

    <div v-if="combinedOptions.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="option in combinedOptions"
        :key="option"
        @click="toggleEquipment(option)"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition truncate',
          isSelected(option)
            ? selectedClass(option)
            : ['text-gray-300 border-gray-600', hoverClass(option)]
        ]"
      >
        {{ option }}
      </button>
    </div>

    <p v-else class="text-center text-gray-500">
      Please select a fitness goal first.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import equipmentOptions from '~/data/equipmentOptions.js'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
})

const primaryOptions = computed(() => equipmentOptions[props.form.primaryGoal] || [])
const secondaryOptions = computed(() => equipmentOptions[props.form.secondaryGoal] || [])

const combinedOptions = computed(() => {
  const all = [...primaryOptions.value, ...secondaryOptions.value]
  return [...new Set(all)].sort()
})

const toggleEquipment = (option) => {
  const index = props.form.equipment.indexOf(option)
  if (index > -1) {
    props.form.equipment.splice(index, 1)
  } else {
    props.form.equipment.push(option)
  }
}

const isSelected = (option) => props.form.equipment.includes(option)

const selectedClass = (option) => {
  const inPrimary = primaryOptions.value.includes(option)
  const inSecondary = secondaryOptions.value.includes(option)

  if (inPrimary && inSecondary) {
    return 'bg-purple-500 text-white border-purple-500'
  } else if (inPrimary) {
    return 'bg-blue-500 text-white border-blue-500'
  } else if (inSecondary) {
    return 'bg-pink-500 text-white border-pink-500'
  }
  return ''
}

const hoverClass = (option) => {
  const inPrimary = primaryOptions.value.includes(option)
  const inSecondary = secondaryOptions.value.includes(option)

  if (inPrimary && inSecondary) {
    return 'hover:border-purple-500 hover:text-white'
  } else if (inPrimary) {
    return 'hover:border-blue-500 hover:text-white'
  } else if (inSecondary) {
    return 'hover:border-pink-500 hover:text-white'
  }
  return 'hover:border-gray-400 hover:text-white'
}
</script>
