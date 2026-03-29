import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

// Simple in-memory user store (no database needed for now)
const users = new Map()

// Generate a simple token
const generateToken = () => crypto.randomBytes(32).toString('hex')

// Simple password hash (not for production — use bcrypt in production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    // Create user
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    }

    users.set(email, user)

    const token = generateToken()

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
})

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = users.get(email)

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken()

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

export default router
