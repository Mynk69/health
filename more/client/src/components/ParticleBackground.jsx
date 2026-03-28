import { useEffect, useRef } from 'react'

const pbStyles = `
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
`

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Medical-themed particles
    const symbols = ['+', '❤', '●', '◆', '✦']
    const colors = [
      'rgba(14, 165, 233, 0.15)',
      'rgba(56, 189, 248, 0.12)',
      'rgba(20, 184, 166, 0.12)',
      'rgba(125, 211, 252, 0.15)',
      'rgba(139, 92, 246, 0.08)'
    ]

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 18 + 8
        this.speedX = (Math.random() - 0.5) * 0.4
        this.speedY = (Math.random() - 0.5) * 0.3
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.rotation = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        if (this.x > canvas.width + 20) this.x = -20
        if (this.x < -20) this.x = canvas.width + 20
        if (this.y > canvas.height + 20) this.y = -20
        if (this.y < -20) this.y = canvas.height + 20
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.font = `${this.size}px Arial`
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.symbol, 0, 0)
        ctx.restore()
      }
    }

    // Create particles
    const count = Math.min(35, Math.floor((canvas.width * canvas.height) / 30000))
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    // Draw connecting lines between nearby particles
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.03 * (1 - dist / 200)})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      drawLines()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <style>{pbStyles}</style>
      <canvas ref={canvasRef} className="particle-canvas" />
    </>
  )
}
