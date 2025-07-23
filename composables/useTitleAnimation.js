import { onMounted } from 'vue'
import gsap from 'gsap'

export const useTitleAnimation = () => {
  onMounted(() => {
    gsap.from('.title', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
  })
}