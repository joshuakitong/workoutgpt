import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkoutStore = defineStore('workout', () => {
  const currentWorkout = ref(loadCurrentWorkout())
  const workouts = ref(loadWorkoutList())

  function setCurrentWorkout(workout) {
    currentWorkout.value = workout
    saveCurrentWorkout(workout)
  }

  function addWorkout(workout) {
    workouts.value.push(workout)
    saveWorkoutList(workouts.value)
  }

  function loadCurrentWorkout() {
    const data = localStorage.getItem('currentWorkout')
    return data ? JSON.parse(data) : null
  }

  function saveCurrentWorkout(data) {
    localStorage.setItem('currentWorkout', JSON.stringify(data))
  }

  function loadWorkoutList() {
    const data = localStorage.getItem('workouts')
    return data ? JSON.parse(data) : []
  }

  function saveWorkoutList(data) {
    localStorage.setItem('workouts', JSON.stringify(data))
  }

  return {
    currentWorkout,
    workouts,
    setCurrentWorkout,
    addWorkout
  }
})