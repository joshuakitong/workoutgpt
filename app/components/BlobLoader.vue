<template>
  <div class="flex items-center justify-center mx-auto w-12 h-12">
    <div ref="dotsContainer" class="flex gap-1">
      <div
        v-for="i in 3"
        :key="i"
        class="dot w-3 h-3 rounded-full"
        :class="[
          i === 1 ? 'bg-blue-500' : '',
          i === 2 ? 'bg-purple-500' : '',
          i === 3 ? 'bg-pink-500' : ''
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const dotsContainer = ref(null)

onMounted(() => {
  const dots = dotsContainer.value.querySelectorAll('.dot')
  gsap.to(dots, {
    y: -12,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    stagger: {
      each: 0.2,
      repeat: -1,
      yoyo: true
    },
    duration: 0.5
  })
})
</script>