import { useEffect, useRef } from 'react'
import { createParticleOrb } from './ParticleOrb'

export default function MiniParticleOrb() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const destroy = createParticleOrb(container, { mini: true })

    return () => destroy()
  }, [])

  return <div ref={containerRef} className="mini-particle-orb" />
}