import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

const SYSTEM_PROMPT = `You are MedAI Doctor, a highly knowledgeable and compassionate AI medical assistant. You provide helpful health information, symptom analysis, and general wellness advice.

Guidelines:
- Be warm, empathetic, and professional in your responses
- Provide detailed but easy-to-understand health information
- When discussing symptoms, suggest possible causes and home remedies
- Always recommend consulting a real doctor for serious concerns
- Focus on diet-based healing and natural remedies when appropriate
- For diet advice, be specific with food items, quantities, and meal timing
- Provide evidence-based information
- Use emojis sparingly to make responses friendly
- Never diagnose definitively — always say "this could indicate..." or "you may want to check for..."
- If someone describes an emergency (chest pain, difficulty breathing, severe bleeding), immediately advise calling emergency services
- Keep responses concise but thorough (aim for 150-300 words)
- Format responses with line breaks for readability

Important disclaimer to include when relevant:
"⚕️ This is general health information only. Please consult a qualified healthcare professional for personalized medical advice."`

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: 'Gemini API key not configured. Please add your key to server/.env' })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Build conversation history for context
    const chatHistory = []

    // Add system instruction as the first exchange
    chatHistory.push({
      role: 'user',
      parts: [{ text: 'You are MedAI Doctor. Follow these instructions for all responses: ' + SYSTEM_PROMPT }]
    })
    chatHistory.push({
      role: 'model',
      parts: [{ text: "I understand! I'm MedAI Doctor, your AI medical assistant. I'll provide helpful, empathetic health guidance while always recommending professional consultation for serious concerns. How can I help you today? 😊" }]
    })

    // Add previous conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        chatHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })
      }
    }

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    })

    // Send the current message
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    res.json({ response: responseText })

  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({
      error: error.message || 'Failed to get AI response. Please try again.'
    })
  }
})

export default router
