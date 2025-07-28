<template>
  <div class="relative" ref="dropdownRef">
    <!-- Vertical Three Dot Icon -->
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-full hover:bg-[#353739] active:bg-[#4c4e4f] transition-colors disabled:hover:bg-transparent duration-300"
      :disabled="props.disabled"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current text-[#babdbc]" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="19" r="2"/>
      </svg>
    </button>

    <transition
      name="fade"
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 z-50"
      >
        <button
          @click="handleRename"
          class="block w-full px-5 py-2 rounded-full bg-blue-500 text-left px-4 py-2 text-sm text-white text-center shadow-md hover:brightness-110"
        >
          Rename
        </button>
        <button
          @click="handleDelete"
          class="block w-full px-5 py-2 rounded-full mt-2 bg-red-500 text-left px-4 py-2 text-sm text-white text-center shadow-md hover:brightness-110"
        >
          Delete
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  workout: Object,
  disabled: Boolean
})
const emit = defineEmits(['startRename', 'confirmDelete'])

const isOpen = ref(false)
const dropdownRef = ref(null)

function handleRename() {
  emit('startRename', props.workout)
  isOpen.value = false
}

function handleDelete() {
  emit('confirmDelete', props.workout)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
