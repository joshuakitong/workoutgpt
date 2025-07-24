export default defineEventHandler(async (event) => {
  const apiKey = process.env.NUXT_GEMINI_API_KEY
  const body = await readBody(event)
  const prompt = body?.prompt

  if (!apiKey || !prompt) {
    return { error: true, message: 'Missing API key or prompt' }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    )

    const result = await response.json()

    if (result?.candidates?.length) {
      return { content: result.candidates[0].content.parts[0].text }
    } else {
      return { error: true, message: 'No content generated', detail: result }
    }
  } catch (err) {
    console.error('[Gemini API Error]', err)
    return { error: true, message: 'Gemini API failed', detail: err?.message || err }
  }
})