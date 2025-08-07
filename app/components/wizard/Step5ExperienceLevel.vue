<template>
  <div class="form-step-container">
    <div>
      <h2 class="form-step-title">What is your experience level?</h2>
      <p class="form-step-subtitle">(Select one)</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="level in levels"
        :key="level"
        @click="form.experience = level"
        :class="[
          'py-3 px-4 rounded-full font-semibold border transition-all duration-300 truncate',
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
