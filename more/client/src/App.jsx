import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import ReportAnalysis from './pages/ReportAnalysis'
import ChatAssistant from './pages/ChatAssistant'
import HealthPredict from './pages/HealthPredict'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <ParticleBackground />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze" element={
              <ProtectedRoute>
                <ReportAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatAssistant />
              </ProtectedRoute>
            } />
            <Route path="/predict" element={
              <ProtectedRoute>
                <HealthPredict />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
