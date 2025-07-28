<template>
  <div class="w-full max-w-2xl space-y-6 mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-center">Any notes or preferences?</h2>
      <p class="text-center text-sm text-[#a2a9b0] mt-2">(Optional)</p>
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