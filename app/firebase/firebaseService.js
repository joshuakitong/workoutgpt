import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkoutStore = defineStore('workout', () => {
  const currentWorkout = ref(null)
  const workouts = ref([])

  if (typeof window !== 'undefined') {
    currentWorkout.value = loadCurrentWorkout()
    workouts.value = loadWorkoutList()
  }

  function setCurrentWorkout(workout) {
    currentWorkout.value = workout
    if (typeof window !== 'undefined') {
      saveCurrentWorkout(workout)
    }
  }

  function addWorkout(workout) {
    workouts.value.push(workout)
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
      return data ? JSON.parse(data) : []
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
    currentWorkout,
    workouts,
    setCurrentWorkout,
    addWorkout,
    deleteWorkout
  }
})
