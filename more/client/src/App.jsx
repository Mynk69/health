import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import Landing from './pages/Landing'
import ReportAnalysis from './pages/ReportAnalysis'
import ChatAssistant from './pages/ChatAssistant'
import HealthPredict from './pages/HealthPredict'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <div className="app">
      <ParticleBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<ReportAnalysis />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/predict" element={<HealthPredict />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
