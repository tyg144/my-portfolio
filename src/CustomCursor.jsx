
import { useEffect, useState } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const updateEnabled = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches)
    }

    updateEnabled()
    finePointer.addEventListener('change', updateEnabled)
    reducedMotion.addEventListener('change', updateEnabled)

    return () => {
      finePointer.removeEventListener('change', updateEnabled)
      reducedMotion.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const cursor = document.querySelector('.custom-cursor')
    if (!cursor) return

    let frame
    let mouseX = -100
    let mouseY = -100
    let ringX = mouseX
    let ringY = mouseY

    const move = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      cursor.classList.add('cursor-visible')

      const target = event.target
      cursor.classList.toggle(
        'cursor-hover',
        Boolean(target.closest('a, button, [role="button"]'))
      )
    }

    const leave = () => {
      cursor.classList.remove('cursor-visible')
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      cursor.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`

      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-ring" />
    </div>
  )
}
