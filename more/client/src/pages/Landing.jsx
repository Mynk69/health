import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const styles = `
.landing { position: relative; z-index: 1; }

/* ===== Hero ===== */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 8s ease-in-out infinite;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 10s ease-in-out infinite 2s;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(20, 184, 166, 0.1));
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-600);
  margin-bottom: 20px;
  animation: fadeInUp 0.6s ease;
}

.hero-badge .dot {
  width: 8px;
  height: 8px;
  background: var(--accent-emerald);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.8rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease;
}

.hero-title .highlight {
  background: linear-gradient(135deg, var(--primary-500), var(--accent-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-description {
  font-size: 1.15rem;
  color: var(--gray-500);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 500px;
  animation: fadeInUp 1s ease;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 1.2s ease;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-top: 50px;
  animation: fadeInUp 1.4s ease;
}

.hero-stat {
  text-align: center;
}

.hero-stat .stat-number {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-600);
}

.hero-stat .stat-label {
  font-size: 0.85rem;
  color: var(--gray-400);
  margin-top: 4px;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  animation: fadeIn 1.5s ease;
}

.hero-card-main {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.15);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.12);
  transform: perspective(1000px) rotateY(-5deg) rotateX(3deg);
  transition: transform 0.5s ease;
}

.hero-card-main:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.hero-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.hero-card-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-400), var(--accent-teal));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25);
}

.hero-card-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--gray-800);
}

.hero-card-subtitle {
  font-size: 0.85rem;
  color: var(--gray-400);
}

.hero-card-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--primary-50);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.hero-card-item:hover {
  background: var(--primary-100);
  transform: translateX(5px);
}

.hero-card-item .item-icon {
  width: 38px;
  height: 38px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.hero-card-item .item-text {
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--gray-700);
}

/* Floating elements */
.floating-badge {
  position: absolute;
  background: white;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 14px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: float 4s ease-in-out infinite;
  z-index: 2;
}

.floating-badge.top-right {
  top: -10px;
  right: -20px;
  animation-delay: 0s;
}

.floating-badge.bottom-left {
  bottom: 20px;
  left: -30px;
  animation-delay: 2s;
}

.floating-badge .badge-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.floating-badge .badge-text {
  font-weight: 700;
  font-size: 0.9rem;
}

.floating-badge .badge-sub {
  font-size: 0.75rem;
  color: var(--gray-400);
}

/* ===== Features ===== */
.features {
  padding: 100px 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-600);
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.6rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--gray-500);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 24px;
  padding: 36px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-400), var(--accent-teal));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(14, 165, 233, 0.12);
  border-color: rgba(14, 165, 233, 0.2);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.feature-card:nth-child(1) .feature-icon { background: linear-gradient(135deg, #e0f2fe, #bae6fd); }
.feature-card:nth-child(2) .feature-icon { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
.feature-card:nth-child(3) .feature-icon { background: linear-gradient(135deg, #ede9fe, #ddd6fe); }

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--gray-800);
}

.feature-description {
  font-size: 0.95rem;
  color: var(--gray-500);
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--primary-600);
  font-size: 0.95rem;
  transition: gap 0.3s ease;
}

.feature-card:hover .feature-link {
  gap: 12px;
}

/* ===== How It Works ===== */
.how-it-works {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent, rgba(14, 165, 233, 0.03), transparent);
}

.steps-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-card {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px 36px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.step-card:hover {
  transform: translateX(10px);
  box-shadow: 0 10px 40px rgba(14, 165, 233, 0.1);
}

.step-number {
  width: 52px;
  height: 52px;
  min-width: 52px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.step-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.step-content p {
  font-size: 0.95rem;
  color: var(--gray-500);
}

/* ===== CTA ===== */
.cta-section {
  padding: 100px 0;
}

.cta-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  border-radius: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.cta-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
}

.cta-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 36px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 40px;
  background: white;
  color: var(--primary-600);
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.cta-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

/* ===== Footer ===== */
.footer {
  padding: 60px 0 30px;
  border-top: 1px solid var(--gray-200);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-brand h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--primary-600);
}

.footer-brand p {
  color: var(--gray-500);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-col h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--gray-800);
}

.footer-col a {
  display: block;
  color: var(--gray-500);
  font-size: 0.9rem;
  padding: 4px 0;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: var(--primary-500);
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
  font-size: 0.85rem;
  color: var(--gray-400);
}

/* ===== Responsive ===== */
@media (max-width: 968px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; gap: 40px; }
  .hero-description { margin: 0 auto 36px; }
  .hero-buttons { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .hero-title { font-size: 2.8rem; }
  .features-grid { grid-template-columns: 1fr; max-width: 500px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .hero-title { font-size: 2.2rem; }
  .hero-stats { gap: 24px; flex-wrap: wrap; }
  .cta-card { padding: 40px 24px; margin: 0 16px; }
  .cta-title { font-size: 1.8rem; }
  .step-card { flex-direction: column; text-align: center; }
  .footer-grid { grid-template-columns: 1fr; }
}
`

function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let current = 0
    const step = Math.ceil(end / 40)
    const timer = setInterval(() => {
      current += step
      if (current >= end) { setCount(end); clearInterval(timer) }
      else setCount(current)
    }, 40)
    return () => clearInterval(timer)
  }, [end])
  return <>{count}{suffix}</>
}

export default function Landing() {
  return (
    <>
      <style>{styles}</style>
      <div className="landing">
        {/* ===== Hero ===== */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="dot" />
                AI-Powered Healthcare Platform
              </div>
              <h1 className="hero-title">
                Your <span className="highlight">AI Personal Doctor</span> Available 24/7
              </h1>
              <p className="hero-description">
                Upload medical reports for instant analysis, chat with our AI doctor anytime, 
                and predict potential health risks — all powered by advanced artificial intelligence.
              </p>
              <div className="hero-buttons">
                <Link to="/analyze" className="btn-primary">
                  📄 Analyze Report
                </Link>
                <Link to="/chat" className="btn-secondary">
                  💬 Talk to AI Doctor
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="stat-number"><Counter end={24} />/7</div>
                  <div className="stat-label">AI Availability</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-number"><Counter end={50} suffix="K+" /></div>
                  <div className="stat-label">Reports Analyzed</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-number"><Counter end={98} suffix="%" /></div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-main">
                <div className="hero-card-header">
                  <div className="hero-card-avatar">🤖</div>
                  <div>
                    <div className="hero-card-title">MedAI Assistant</div>
                    <div className="hero-card-subtitle">Online • Ready to help</div>
                  </div>
                </div>
                <div className="hero-card-items">
                  <div className="hero-card-item">
                    <div className="item-icon">📋</div>
                    <div className="item-text">Medical Report Analysis</div>
                  </div>
                  <div className="hero-card-item">
                    <div className="item-icon">💊</div>
                    <div className="item-text">Medicine Recommendations</div>
                  </div>
                  <div className="hero-card-item">
                    <div className="item-icon">🥗</div>
                    <div className="item-text">Diet & Nutrition Plans</div>
                  </div>
                  <div className="hero-card-item">
                    <div className="item-icon">🔮</div>
                    <div className="item-text">Health Risk Prediction</div>
                  </div>
                </div>
              </div>
              <div className="floating-badge top-right">
                <div className="badge-icon" style={{ background: '#d1fae5' }}>✅</div>
                <div>
                  <div className="badge-text" style={{ color: '#059669' }}>Report Analyzed</div>
                  <div className="badge-sub">Just now</div>
                </div>
              </div>
              <div className="floating-badge bottom-left">
                <div className="badge-icon" style={{ background: '#e0f2fe' }}>❤️</div>
                <div>
                  <div className="badge-text" style={{ color: '#0284c7' }}>Health Score</div>
                  <div className="badge-sub">92/100</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Features ===== */}
        <section className="features">
          <div className="section-header">
            <div className="section-tag">✨ Core Features</div>
            <h2 className="section-title">Everything You Need for <span className="gradient-text">Better Health</span></h2>
            <p className="section-subtitle">Powered by advanced AI to give you instant medical insights, 24/7 support, and predictive health analytics.</p>
          </div>
          <div className="features-grid">
            <Link to="/analyze" className="feature-card">
              <div className="feature-icon">📄</div>
              <h3 className="feature-title">Report Analysis</h3>
              <p className="feature-description">Upload your medical report image and get instant AI-powered analysis with medicine recommendations, treatment plans, and dietary advice.</p>
              <span className="feature-link">Try it now →</span>
            </Link>
            <Link to="/chat" className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Doctor Chat</h3>
              <p className="feature-description">Chat with our AI medical assistant 24/7. Get personalized health advice, symptom analysis, and home remedy suggestions anytime.</p>
              <span className="feature-link">Start chatting →</span>
            </Link>
            <Link to="/predict" className="feature-card">
              <div className="feature-icon">🔮</div>
              <h3 className="feature-title">Health Prediction</h3>
              <p className="feature-description">Input your body metrics and lifestyle data to predict potential health risks. Get personalized prevention strategies and recommendations.</p>
              <span className="feature-link">Predict now →</span>
            </Link>
          </div>
        </section>

        {/* ===== How It Works ===== */}
        <section className="how-it-works">
          <div className="section-header">
            <div className="section-tag">⚡ How It Works</div>
            <h2 className="section-title">Simple Steps to <span className="gradient-text">Better Health</span></h2>
            <p className="section-subtitle">Get started in minutes with our intuitive AI-powered platform.</p>
          </div>
          <div className="steps-container">
            {[
              { num: 1, title: 'Upload Your Medical Report', desc: 'Take a photo or upload an image of your medical report. Our OCR technology extracts the data automatically.' },
              { num: 2, title: 'AI Analyzes Your Report', desc: 'Our advanced AI processes your report and identifies diagnosis, medicines, treatment plans, and dietary recommendations.' },
              { num: 3, title: 'Get Personalized Insights', desc: 'Receive detailed analysis with medicine dosages, dietary plans, precautions, and when to follow up with your doctor.' },
              { num: 4, title: 'Chat & Predict', desc: 'Continue your health journey with 24/7 AI chat support and predictive health risk assessment based on your biometrics.' }
            ].map(step => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">Ready to Transform Your Healthcare?</h2>
              <p className="cta-text">Join thousands of users who trust MedAI for instant medical insights and personalized health guidance.</p>
              <Link to="/register" className="cta-btn">
                Get Started Free 🚀
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-brand">
                <h3>🩺 MedAI</h3>
                <p>Your AI-powered personal doctor. Get instant medical insights, 24/7 health support, and predictive analytics — all in one platform.</p>
              </div>
              <div className="footer-col">
                <h4>Features</h4>
                <Link to="/analyze">Report Analysis</Link>
                <Link to="/chat">AI Doctor</Link>
                <Link to="/predict">Health Prediction</Link>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">FAQ</a>
              </div>
            </div>
            <div className="footer-bottom">
              © 2024 MedAI. Built with ❤️ for better healthcare. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
