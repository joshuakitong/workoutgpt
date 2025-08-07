<template>
  <div class="form-step-container">
    <div>
      <h2 class="form-step-title">
        What do you want to focus on?
      </h2>
      <p class="form-step-subtitle">(Select at least 1)</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="option in combinedOptions"
        :key="option"
        @click="toggleTarget(option)"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition-all duration-300 truncate',
          isSelected(option)
            ? selectedClass(option)
            : [
                'text-gray-300 border-gray-600',
                hoverClass(option)
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
import focusTargets from '~/data/focusTargets.js'

const props = defineProps({ form: Object })
const { form } = toRefs(props)

const primaryOptions = computed(() => focusTargets[form.value.primaryGoal] || [])
const secondaryOptions = computed(() => focusTargets[form.value.secondaryGoal] || [])

const combinedOptions = computed(() => {
  const all = [...primaryOptions.value, ...secondaryOptions.value]
  return [...new Set(all)].sort()
})

const toggleTarget = (option) => {
  const index = form.value.targets.indexOf(option)
  if (index > -1) {
    form.value.targets.splice(index, 1)
  } else {
    form.value.targets.push(option)
  }
}

const isSelected = (option) => form.value.targets.includes(option)

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
