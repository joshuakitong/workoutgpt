import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useWorkoutStore } from '@/firebase/firebaseService'

export default defineNuxtPlugin((nuxtApp) => {
  const { $firebaseApp } = useNuxtApp()
  const store = useWorkoutStore()

  const auth = getAuth($firebaseApp)

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await store.setUser(user)
    } else {
      store.clearUser()
    }
  })
})