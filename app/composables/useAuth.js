import { signInWithGoogle, signOutUser } from '@/firebase/authService'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Sign-in failed:', err)
    }
  }

  const signOut = async () => {
    try {
      await signOutUser()
      router.push('/').then(() => window.location.reload())
    } catch (err) {
      console.error('Sign-out failed:', err)
    }
  }

  return {
    signIn,
    signOut
  }
}