<template>
  <div class="w-full max-w-2xl space-y-8 mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-center">
        What do you want to focus on?
      </h2>
      <p class="text-center text-sm text-[#a2a9b0] mt-2">(Select at least 1)</p>
    </div>

    <div v-if="combinedOptions.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="option in combinedOptions"
        :key="option"
        @click="toggleTarget(option)"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition truncate',
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

    <p v-else class="text-center text-gray-500">
      Please select a fitness goal first.
    </p>
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
  return [...new Set(all)]
})

const toggleTarget = (target) => {
  const index = form.value.targets.indexOf(target)
  if (index > -1) {
    form.value.targets.splice(index, 1)
  } else {
    form.value.targets.push(target)
  }
}

const isSelected = (target) => form.value.targets.includes(target)

const selectedClass = (target) => {
  if (primaryOptions.value.includes(target)) {
    return 'bg-blue-500 text-white border-blue-500'
  } else if (secondaryOptions.value.includes(target)) {
    return 'bg-pink-500 text-white border-pink-500'
  }
  return ''
}

const hoverClass = (option) => {
  if (primaryOptions.value.includes(option)) {
    return 'hover:border-blue-500 hover:text-white'
  } else if (secondaryOptions.value.includes(option)) {
    return 'hover:border-pink-500 hover:text-white'
  }
  return 'hover:border-gray-400 hover:text-white'
}
</script>
