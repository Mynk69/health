import { Router } from 'express'
import multer from 'multer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `report-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, PNG, JPEG, and WEBP images are allowed'), false)
    }
  }
})

// POST /api/report/analyze
router.post('/analyze', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No report image uploaded' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: 'Gemini API key not configured. Please add your key to server/.env' })
    }

    // Read the uploaded image and convert to base64
    const imagePath = req.file.path
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')
    const mimeType = req.file.mimetype

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a highly experienced medical professional AI assistant. Analyze the following medical report image thoroughly.

Provide your analysis in the following strict JSON format (no markdown, no code fences, just raw JSON):
{
  "diagnosis": "A clear summary of the diagnosis or findings from the report",
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "Dosage amount",
      "frequency": "How often to take",
      "duration": "How long to take"
    }
  ],
  "treatment": [
    "Treatment step or recommendation 1",
    "Treatment step or recommendation 2"
  ],
  "diet": [
    {
      "food": "Food item name",
      "benefit": "Why this food helps",
      "amount": "Recommended daily amount"
    }
  ],
  "precautions": [
    "Precaution or warning 1",
    "Precaution or warning 2"
  ],
  "followUp": "When and how to follow up with a doctor"
}

Important guidelines:
- If the image is not a medical report, still try to provide health-related guidance
- Provide at least 3-5 medicines if applicable
- Provide at least 4-6 diet recommendations
- Provide at least 3-5 treatment steps
- Provide at least 3-5 precautions
- Always recommend following up with a real doctor
- Focus on natural remedies and diet-based healing where possible
- Be detailed and specific in your recommendations`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      }
    ])

    const responseText = result.response.text()

    // Clean up uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err)
    })

    // Try to parse as JSON
    try {
      // Remove potential markdown code fences
      let cleanJson = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim()

      const analysis = JSON.parse(cleanJson)
      res.json({ analysis })
    } catch (parseErr) {
      // If JSON parsing fails, return raw text
      console.log('JSON parse failed, returning raw analysis')
      res.json({ analysis: { rawAnalysis: responseText } })
    }

  } catch (error) {
    console.error('Report analysis error:', error)

    // Clean up file on error
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {})
    }

    res.status(500).json({
      error: error.message || 'Failed to analyze report. Please try again.'
    })
  }
})

export default router
