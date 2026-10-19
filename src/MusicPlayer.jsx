
import { useEffect, useRef } from "react"

export default function MusicPlayer() {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    // Attempt to play automatically when a visitor arrives.
    audio.play().catch((error) => {
      console.log("Browser blocked autoplay:", error)
    })
  }, [])

  return (
    <audio
      ref={audioRef}
      src="/portfolio.mp3"
      autoPlay
      loop
      preload="auto"
    />
  )
}
