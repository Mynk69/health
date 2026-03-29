import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Routes
import reportRoutes from './routes/report.js'
import chatRoutes from './routes/chat.js'
import predictRoutes from './routes/predict.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
//404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})


// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5001'],
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// API Routes
app.use('/api/report', reportRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/predict', predictRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedAI Server is running 🩺' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🩺 MedAI Server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints:`)
  console.log(`   POST /api/report/analyze  — Medical Report Analysis`)
  console.log(`   POST /api/chat            — AI Doctor Chat`)
  console.log(`   POST /api/predict          — Health Risk Prediction`)
  console.log(`   POST /api/auth/register   — User Registration`)
  console.log(`   POST /api/auth/login      — User Login`)
  console.log(`   GET  /api/health          — Health Check\n`)

  // if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'GEMINI_API_KEY') {
  //   console.warn('⚠️  WARNING: GEMINI_API_KEY is not set!')
  //   console.warn('   Get your free key at: https://aistudio.google.com/apikey')
  //   console.warn('   Then update it in more/server/.env\n')
  // }

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is not set!')
  }

})
