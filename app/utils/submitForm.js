export async function submitFormToGemini(formData) {
  const prompt = `
You are a fitness coach. Based on the user's preferences, generate a one-session workout plan in JSON format with the following structure:

{
  'title': 'Workout Title',
  'goals': ['Strength', 'Cardiovascular'],
  'duration': '45m',
  'experience': 'Beginner',
  'targets': ['Arms', 'Stamina'],
  'equipment': ['Bodyweight', 'Dumbbells'],
  'segments': [
    {
      'title': 'Warm-Up',
      'duration': '5m',
      'exercises': [
        { 'name': 'Jumping Jacks',
          'reps': '2 x 30 sec',
          'description': 'Light cardio warm-up',
          'instructions': 'Stand with feet shoulder-width apart...' }
      ]
    },
    {
      'title': 'Main Workout',
      'duration': '30m',
      'exercises': [
        { 'name': 'Bicep Curls',
          'reps': '3 x 10',
          'description': 'Upper body strength',
          'instructions': 'Stand with feet shoulder-width apart...' },
        { 'name': 'Squats',
          'reps': '3 x 10',
          'description': 'Lower body strength',
          'instructions': 'Stand with feet shoulder-width apart...' }
      ]
    },
    {
      'title': 'Cool Down',
      'duration': '5m',
      'exercises': [
        { 'name': 'Stretch',
          'reps': '3 x 30 sec',
          'description': 'Recovery',
          'instructions': 'To stretch safely and effectively...' }
      ]
    }
  ],
  'notes': 'Generate notes for workout plus response to user notes if applicable'
}

User Data:
- Primary Goal: ${formData.primaryGoal}
- Secondary Goal: ${formData.secondaryGoal}
- Target Areas: ${formData.targets.join(', ')}
- Equipment: ${formData.equipment.join(', ')}
- Duration: ${formData.duration}
- Experience: ${formData.experience}
- Notes: ${formData.notes || 'None'}

Respond only with valid JSON.
`;

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })

  const data = await res.json()
  const { content } = data

  if (!content) throw new Error('No content returned from Gemini')

  // Remove markdown-style code blocks (```json ... ```)
  const match = content.match(/```json\s*([\s\S]*?)```/i)

  if (!match || !match[1]) {
    throw new Error("Could not extract JSON from Gemini response")
  }

  const cleaned = match[1].trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", err, cleaned)
    throw new Error("Invalid JSON from Gemini")
  }
}