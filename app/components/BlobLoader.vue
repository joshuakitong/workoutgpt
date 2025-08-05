<template>
  <div class="flex items-center justify-center mx-auto w-12 h-12">
    <div ref="dot" class="w-5 h-5 rounded-full bg-blue-500"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const dot = ref(null)

onMounted(() => {
  const el = dot.value

  gsap.timeline({ repeat: -1 })
    .to(el, {
      scale: 1,
      backgroundColor: '#8B5CF6', // purple-500
      duration: 1.25,
      ease: 'power1.inOut'
    })
    .to(el, {
      scale: 1.25,
      backgroundColor: '#EC4899', // pink-500
      duration: 1.25,
      ease: 'power1.inOut'
    })
    .to(el, {
      scale: 1,
      backgroundColor: '#3B82F6', // blue-500 (back to start)
      duration: 1.25,
      ease: 'power1.inOut'
    })
})
</script>

<style scoped>
div[ref="dot"] {
  transform-origin: center;
}
</style>
