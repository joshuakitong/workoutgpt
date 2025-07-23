<template>
  <div class="w-full max-w-2xl space-y-8 mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-center">What is your experience level?</h2>
      <p class="text-center text-sm text-[#a2a9b0] mt-2">(Select one)</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="level in levels"
        :key="level"
        @click="form.experience = level"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition truncate',
          form.experience === level
            ? 'bg-blue-500 text-white border-blue-500'
            : 'text-gray-300 border-gray-600 hover:border-blue-500 hover:text-white'
        ]"
      >
        {{ level }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ form: Object })
const levels = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Elite']
</script>
