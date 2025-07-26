<template>
  <div
    :class="[
      'animate-pulse bg-[#353739] rounded-md skeleton-shimmer',
      height,
      width,
      rounded
    ]"
  />
</template>

<script setup>
defineProps({
  height: {
    type: String,
    default: 'h-6',
  },
  width: {
    type: String,
    default: 'w-full',
  },
  rounded: {
    type: String,
    default: 'rounded'
  },
})
</script>