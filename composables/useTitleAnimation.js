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

    gsap.to('.title', {
      backgroundPosition: '100% 0%',
      duration: 10,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  })
}
