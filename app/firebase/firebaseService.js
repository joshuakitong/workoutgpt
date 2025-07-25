import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkoutStore = defineStore('workout', () => {
  const user = ref(null)
  const currentWorkout = ref(null)
  const workouts = ref([])

  const setUser = (userData) => {
    user.value = userData ? {
      uid: userData.uid,
      displayName: userData.displayName,
      email: userData.email,
      photoURL: userData.photoURL
    } : null
  }

  const clearUser = () => {
    user.value = null
  }

  if (typeof window !== 'undefined') {
    currentWorkout.value = loadCurrentWorkout()
    workouts.value = loadWorkoutList()
  }

  const initializeStore = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workouts')
      workouts.value = saved ? JSON.parse(saved) : []
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

  function addWorkout(workout) {
    workouts.value.push(workout)
    workouts.value.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    if (typeof window !== 'undefined') {
      saveWorkoutList(workouts.value)
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

  function loadWorkoutList() {
    try {
      const data = localStorage.getItem('workouts')
      const parsed = data ? JSON.parse(data) : []
      return parsed.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    } catch (e) {
      console.warn('Failed to load workout list:', e)
      return []
    }
  }

  function saveWorkoutList(data) {
    try {
      localStorage.setItem('workouts', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save workout list:', e)
    }
  }

  function updateWorkout(updated) {
    const index = workouts.value.findIndex(w => w.id === updated.id)
    if (index !== -1) {
      workouts.value.splice(index, 1, updated)
      saveWorkoutList(workouts.value)
    }
  }

  function deleteWorkout(id) {
    const index = workouts.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts.value.splice(index, 1)
      if (process.client) saveWorkoutList(workouts.value)
    }

    if (currentWorkout.value?.id === id) {
      currentWorkout.value = null
      if (process.client) localStorage.removeItem('currentWorkout')
    }
  }

  return {
    user,
    currentWorkout,
    workouts,
    initializeStore,
    setCurrentWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    setUser,
    clearUser
  }
})
