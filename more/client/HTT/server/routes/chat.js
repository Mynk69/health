const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are MedAI, a friendly and knowledgeable AI medical assistant available 24/7. You act as a personal doctor providing health guidance.

IMPORTANT RULES:
- Always be empathetic, warm, and professional
- Provide evidence-based medical information
- Always recommend consulting a real doctor for serious conditions
- Never diagnose definitively - use phrases like "this could indicate" or "you might want to check"
- Suggest home remedies and lifestyle changes when appropriate
- If symptoms sound serious or life-threatening, urgently recommend emergency care
- Format your responses with clear sections using emojis for readability
- Keep responses concise but thorough`;

    // Build conversation with context
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are MedAI, my personal medical assistant. Please follow these guidelines: ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'Hello! I\'m MedAI, your personal AI medical assistant. I\'m here 24/7 to help you with health questions, symptoms, nutrition advice, and general wellness guidance. How can I help you today? 😊' }] },
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }))
      ]
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ success: true, response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed: ' + err.message });
  }
});

module.exports = router;
