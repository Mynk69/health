import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = `
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 60px;
  position: relative;
  z-index: 1;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(14, 165, 233, 0.15);
  border-radius: 28px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.1);
  animation: fadeInUp 0.7s ease;
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-400), var(--accent-teal), var(--primary-500));
}

.auth-logo {
  text-align: center;
  margin-bottom: 8px;
  font-size: 2.5rem;
}

.auth-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.auth-subtitle {
  text-align: center;
  color: var(--gray-500);
  font-size: 0.95rem;
  margin-bottom: 36px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-700);
}

.auth-field input {
  padding: 14px 18px;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 14px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.auth-field input:focus {
  border-color: var(--primary-400);
  background: white;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.auth-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}

.auth-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.auth-submit:hover::before {
  left: 100%;
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.9rem;
  color: var(--gray-500);
}

.auth-footer a {
  color: var(--primary-600);
  font-weight: 600;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: var(--primary-700);
}

.auth-error {
  padding: 12px 16px;
  background: rgba(244, 63, 94, 0.06);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 12px;
  color: var(--accent-rose);
  font-size: 0.9rem;
  text-align: center;
}

.auth-success {
  padding: 12px 16px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  color: var(--accent-emerald);
  font-size: 0.9rem;
  text-align: center;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--gray-400);
  font-size: 0.85rem;
  margin: 4px 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-200);
}

.floating-icons {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.08;
  animation: float 8s ease-in-out infinite;
}

@media (max-width: 480px) {
  .auth-card { padding: 36px 24px; }
  .auth-title { font-size: 1.5rem; }
}
`

const API_URL = '/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="floating-icons">
        <span className="floating-icon" style={{ top: '15%', left: '10%', animationDelay: '0s' }}>🩺</span>
        <span className="floating-icon" style={{ top: '30%', right: '15%', animationDelay: '2s' }}>💊</span>
        <span className="floating-icon" style={{ bottom: '25%', left: '20%', animationDelay: '4s' }}>❤️</span>
        <span className="floating-icon" style={{ top: '60%', right: '10%', animationDelay: '1s' }}>🔬</span>
        <span className="floating-icon" style={{ top: '10%', right: '30%', animationDelay: '3s' }}>🧬</span>
      </div>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">🩺</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to your MedAI account</p>
          
          {error && <div className="auth-error">⚠️ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🔑 Log In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  )
}
