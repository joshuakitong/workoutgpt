<template>
  <div class="w-full max-w-2xl space-y-8 mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-center">How long do you want your session to be?</h2>
      <p class="text-center text-sm text-[#a2a9b0] mt-2">(Select one)</p>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-3 gap-4">
      <button
        v-for="option in options"
        :key="option"
        @click="selectDuration(option)"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition truncate',
          form.duration === option
            ? 'bg-blue-500 text-white border-blue-500'
            : 'text-gray-300 border-gray-600 hover:border-blue-500 hover:text-white'
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ form: Object })

const options = ['15m', '30m', '45m', '60m', '90m', '120m']

const selectDuration = (value) => {
  props.form.duration = value
}
</script>