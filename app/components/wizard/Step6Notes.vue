<template>
  <div class="form-step-container">
    <div>
      <h2 class="form-step-title">Any notes or preferences?</h2>
      <p class="form-step-subtitle">(Optional)</p>
    </div>
    <div>
      <textarea
        v-model="form.notes"
        maxlength="500"
        rows="8"
        placeholder="e.g. Avoid burpees, prefer bodyweight, focus on specific muscles..."
        class="w-full px-4 py-3 rounded-3xl bg-[#1e1e1e] text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-500"
      ></textarea>
      <p class="text-right text-sm text-gray-500">{{ form.notes.length }}/500</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ form: Object })
</script>