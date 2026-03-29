import { useState, useRef, useEffect } from 'react'

const styles = `
.chat-page {
  min-height: 100vh;
  padding: 80px 24px 0;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.chat-container {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

/* Chat Header */
.chat-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 20px 20px 0 0;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: fadeInDown 0.5s ease;
}

.chat-avatar {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--primary-400), var(--accent-teal));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.25);
  position: relative;
}

.chat-avatar::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--accent-emerald);
  border: 2px solid white;
  border-radius: 50%;
}

.chat-info h2 {
  font-size: 1.15rem;
  font-weight: 700;
}

.chat-info p {
  font-size: 0.85rem;
  color: var(--accent-emerald);
  font-weight: 500;
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: rgba(248, 250, 252, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
  animation: fadeInUp 0.3s ease;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.message.ai .message-avatar {
  background: linear-gradient(135deg, var(--primary-400), var(--accent-teal));
}

.message.user .message-avatar {
  background: var(--gray-200);
}

.message-bubble {
  padding: 14px 20px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message.ai .message-bubble {
  background: white;
  border: 1px solid var(--gray-200);
  border-bottom-left-radius: 4px;
  color: var(--gray-700);
}

.message.user .message-bubble {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-bottom-right-radius: 4px;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

.typing-dots {
  padding: 16px 22px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: var(--primary-400);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Quick actions */
.quick-actions {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  animation: fadeInUp 0.5s ease;
}

.quick-action {
  padding: 8px 18px;
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--primary-600);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.quick-action:hover {
  background: var(--primary-50);
  border-color: var(--primary-400);
  transform: translateY(-2px);
}

/* Input area */
.chat-input-area {
  padding: 16px 24px 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-top: none;
  border-radius: 0 0 20px 20px;
}

.chat-input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  padding: 14px 20px;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  font-size: 0.95rem;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  transition: border-color 0.3s ease;
}

.chat-input:focus {
  border-color: var(--primary-400);
  background: white;
}

.chat-send-btn {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.chat-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-disclaimer {
  text-align: center;
  font-size: 0.78rem;
  color: var(--gray-400);
  margin-top: 10px;
}

@media (max-width: 600px) {
  .message { max-width: 90%; }
  .quick-actions { padding: 12px 16px; }
  .chat-input-area { padding: 12px 16px 16px; }
}
`

const API_URL = '/api'

const quickActions = [
  "I have a headache",
  "What foods boost immunity?",
  "How to reduce stress?",
  "Fever remedies",
  "Healthy diet tips",
  "Sleep better"
]

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! 👋 I'm MedAI, your personal AI medical assistant. I'm here 24/7 to help with health questions, symptoms, nutrition advice, and general wellness.\n\nHow can I help you today? 😊" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(1).map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content }))
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages([...newMessages, { role: 'ai', content: data.response }])
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: `Sorry, I encountered an error: ${err.message}. Please try again.` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-info">
              <h2>MedAI Doctor</h2>
              <p>● Online — Ready to help</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-avatar">{msg.role === 'ai' ? '🤖' : '👤'}</div>
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="typing-indicator">
                <div className="message-avatar" style={{ width: 36, height: 36, minWidth: 36, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary-400), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="quick-actions">
              {quickActions.map((qa, i) => (
                <button key={i} className="quick-action" onClick={() => sendMessage(qa)}>{qa}</button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms or ask a health question..."
                rows={1}
              />
              <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                ➤
              </button>
            </div>
            <div className="chat-disclaimer">⚕️ This AI provides general health info only. Always consult a real doctor for medical decisions.</div>
          </div>
        </div>
      </div>
    </>
  )
}
