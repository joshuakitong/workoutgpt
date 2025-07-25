import { initializeApp, getApps, getApp } from 'firebase/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

  return {
    provide: {
      firebaseApp: app
    }
  }
})
