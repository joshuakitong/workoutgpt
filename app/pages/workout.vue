<template>
  <div class="text-white p-6 max-w-3xl mx-auto">
    <div v-if="workout">
      <h1 class="text-3xl font-bold mb-1">{{ workout.title }}</h1>
      <p class="text-sm text-gray-400 mb-4">
        Goals: {{ workout.goals.join(', ') }} | Duration: {{ workout.duration }} | Level: {{ workout.experience }}
      </p>

      <p class="text-sm text-gray-400 mb-6">
        Equipment: {{ workout.equipment.join(', ') }}
      </p>

      <div v-for="segment in workout.segments" :key="segment.title" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">{{ segment.title }} ({{ segment.duration }})</h2>
        <ul class="space-y-4">
          <li
            v-for="exercise in segment.exercises"
            :key="exercise.name"
            class="bg-[#1e1e1e] p-4 rounded-xl border border-white/10"
          >
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-lg font-semibold">{{ exercise.name }}</h3>
              <span class="text-sm text-gray-400">{{ exercise.reps }}</span>
            </div>
            <p class="text-sm text-gray-300 mb-2">{{ exercise.description }}</p>
            <p class="text-xs text-gray-400 whitespace-pre-line">{{ exercise.instructions }}</p>
          </li>
        </ul>
      </div>

      <div v-if="workout.notes" class="mt-10">
        <h3 class="text-lg font-semibold mb-2">Notes</h3>
        <p class="text-sm text-gray-300">{{ workout.notes }}</p>
      </div>
    </div>

    <div v-else>
      <p class="text-gray-400 text-center mt-20">No workout found. Please create one from the form first.</p>
    </div>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '@/firebase/firebaseService'

const { currentWorkout: workout } = useWorkoutStore()
</script>
