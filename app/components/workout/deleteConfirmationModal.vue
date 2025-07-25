<template>
  <div
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    @keydown.esc="$emit('cancel')"
    tabindex="0"
  >
    <div class="bg-[#1e1e1e] border border-white/10 p-6 rounded-xl w-[90%] max-w-sm text-white">
      <h2 class="text-xl font-semibold mb-4">Delete Workout?</h2>
      <p class="text-sm text-gray-300 mb-6">
        This will permanently delete the workout. Are you sure?
      </p>

      <div class="flex justify-end gap-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-full text-sm font-medium text-[#a2a9b0] hover:bg-[#353739]"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-full text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'cancel'])
</script>
