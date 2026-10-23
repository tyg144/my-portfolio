import { useEffect, useState } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const [position, setPosition] = useState({
    x: -100,
    y: -100,
  })

  const [ringPosition, setRingPosition] = useState({
    x: -100,
    y: -100,
  })

  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    let frame
    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100

    const handleMouseMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY

      setPosition({ x: targetX, y: targetY })
    }

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.14
      ringY += (targetY - ringY) * 0.14

      setRingPosition({ x: ringX, y: ringY })

      frame = requestAnimationFrame(animateRing)
    }

    const handleMouseOver = (event) => {
      setIsHovering(
        Boolean(
          event.target.closest(
            'a, button, [role="button"], input, textarea'
          )
        )
      )
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)

    frame = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(frame)
    }
  }, [])

  if (
    typeof window !== 'undefined' &&
    (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  ) {
    return null
  }

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      <div
        className={`custom-cursor-ring${isHovering ? ' cursor-hover' : ''}`}
        style={{
          transform: `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  )
}