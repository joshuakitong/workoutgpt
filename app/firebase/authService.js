import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useWorkoutStore } from '@/firebase/firebaseService'

export const signInWithGoogle = async () => {
  const { $firebaseApp } = useNuxtApp()
  const auth = getAuth($firebaseApp)
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)

  const user = result.user
  useWorkoutStore().setUser(user)
}

export const signOutUser = async () => {
  const { $firebaseApp } = useNuxtApp()
  const auth = getAuth($firebaseApp)
  await signOut(auth)
  useWorkoutStore().clearUser()
}