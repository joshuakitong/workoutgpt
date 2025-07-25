import { signInWithGoogle, signOutUser } from '@/firebase/authService'

export const useAuth = () => {
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
    } catch (err) {
      console.error('Sign-out failed:', err)
    }
  }

  return {
    signIn,
    signOut
  }
}