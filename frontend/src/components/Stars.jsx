import { useEffect, useRef } from 'react'

export default function Stars() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.width = `${Math.random() * 3 + 1}px`
      star.style.height = star.style.width
      container.appendChild(star)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)' }}
    />
  )
}
