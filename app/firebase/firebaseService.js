import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'

export const useWorkoutStore = defineStore('workout', () => {
  const user = ref(null)
  const userLoading = ref(true)
  const currentWorkout = ref(null)
  const workouts = ref([])

  const getDB = () => {
    const { $firebaseApp } = useNuxtApp()
    return getFirestore($firebaseApp)
  }

  const setUser = async (userData) => {
    user.value = userData ? {
      uid: userData.uid,
      displayName: userData.displayName,
      email: userData.email,
      photoURL: userData.photoURL
    } : null

    if (user.value) await fetchWorkouts()
    userLoading.value = false
  }

  const clearUser = () => {
    user.value = null
    workouts.value = []
    userLoading.value = false
  }

  if (typeof window !== 'undefined') {
    currentWorkout.value = loadCurrentWorkout()
  }

  const initializeStore = () => {
    if (typeof window !== 'undefined') {
      const current = localStorage.getItem('currentWorkout')
      currentWorkout.value = current ? JSON.parse(current) : null
    }
  }

  function setCurrentWorkout(workout) {
    currentWorkout.value = workout
    if (typeof window !== 'undefined') {
      saveCurrentWorkout(workout)
    }
  }

  function loadCurrentWorkout() {
    try {
      const data = localStorage.getItem('currentWorkout')
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.warn('Failed to load current workout:', e)
      return null
    }
  }

  function saveCurrentWorkout(data) {
    try {
      localStorage.setItem('currentWorkout', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save current workout:', e)
    }
  }

  async function saveWorkout(workout) {
    if (!user.value) return

    const db = getDB()
    const workoutsRef = collection(db, 'users', user.value.uid, 'workouts')

    const workoutId = workout.id || doc(workoutsRef).id

    const docRef = doc(workoutsRef, workoutId)
    const workoutWithMeta = {
      ...workout,
      id: workoutId,
      savedAt: new Date().toISOString(),
    }

    await setDoc(docRef, workoutWithMeta)

    const index = workouts.value.findIndex(w => w.id === workoutId)
    if (index === -1) {
      workouts.value.unshift(workoutWithMeta)
    } else {
      workouts.value.splice(index, 1, workoutWithMeta)
    }

    return workoutId
  }


  async function fetchWorkouts() {
    if (!user.value) return

    const db = getDB()
    const q = query(
      collection(db, 'users', user.value.uid, 'workouts'),
      orderBy('savedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    workouts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  async function deleteWorkout(id) {
    if (!user.value) return

    const db = getDB()
    const docRef = doc(db, 'users', user.value.uid, 'workouts', id)
    await deleteDoc(docRef)

    const index = workouts.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts.value.splice(index, 1)
    }

    if (currentWorkout.value?.id === id) {
      currentWorkout.value = null
      if (process.client) localStorage.removeItem('currentWorkout')
    }
  }

  return {
    user,
    userLoading,
    currentWorkout,
    workouts,
    initializeStore,
    setCurrentWorkout,
    saveWorkout,
    deleteWorkout,
    setUser,
    clearUser,
    fetchWorkouts,
  }
})
