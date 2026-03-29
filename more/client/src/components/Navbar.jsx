import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navStyles = `
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(14, 165, 233, 0.08);
  padding: 10px 0;
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-600);
}

.nav-logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--primary-500), var(--accent-teal));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}

.nav-links a {
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--gray-600);
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--primary-600);
  background: var(--primary-50);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--primary-500);
  border-radius: 2px;
}

.nav-auth {
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-auth .btn-login {
  padding: 10px 22px;
  font-weight: 600;
  color: var(--primary-600);
  border-radius: 12px;
  transition: all 0.3s ease;
  background: transparent;
}

.nav-auth .btn-login:hover {
  background: var(--primary-50);
}

.nav-auth .btn-signup {
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.nav-auth .btn-signup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

/* User menu when logged in */
.nav-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px 6px 8px;
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: 50px;
  cursor: default;
}

.nav-user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500), var(--accent-teal));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
}

.nav-user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gray-700);
}

.btn-logout {
  padding: 10px 20px;
  background: rgba(244, 63, 94, 0.08);
  color: var(--accent-rose);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.3);
  transform: translateY(-1px);
}

.nav-mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: 8px;
  cursor: pointer;
}

.nav-mobile-toggle span {
  width: 24px;
  height: 2.5px;
  background: var(--gray-700);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-mobile-toggle.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-mobile-toggle.open span:nth-child(2) {
  opacity: 0;
}

.nav-mobile-toggle.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .nav-mobile-toggle {
    display: flex;
  }

  .nav-links, .nav-auth, .nav-user {
    display: none;
  }

  .nav-links.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 20px;
    box-shadow: 0 10px 40px rgba(14, 165, 233, 0.1);
    animation: fadeInDown 0.3s ease;
  }

  .nav-auth.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 200px);
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0 20px 20px;
  }

  .nav-user.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 200px);
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 10px 20px 20px;
    gap: 10px;
  }
}
`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      <style>{navStyles}</style>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🩺</div>
            Med<span style={{ color: 'var(--accent-teal)' }}>AI</span>
          </Link>

          <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/analyze" className={location.pathname === '/analyze' ? 'active' : ''}>Report Analysis</Link></li>
            <li><Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>AI Doctor</Link></li>
            <li><Link to="/predict" className={location.pathname === '/predict' ? 'active' : ''}>Health Predict</Link></li>
          </ul>

          {isAuthenticated ? (
            <div className={`nav-user ${mobileOpen ? 'mobile-open' : ''}`}>
              <div className="nav-user-info">
                <div className="nav-user-avatar">{getInitials(user.name)}</div>
                <span className="nav-user-name">{user.name}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className={`nav-auth ${mobileOpen ? 'mobile-open' : ''}`}>
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </div>
          )}

          <button className={`nav-mobile-toggle ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  )
}
