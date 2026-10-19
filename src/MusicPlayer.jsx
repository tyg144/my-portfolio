
import { useEffect, useRef } from "react"

export default function MusicPlayer() {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    const tryPlay = () => {
      audio.play().catch(() => {
        // The browser may block autoplay until user interaction.
      })
    }

    tryPlay()

    const handleFirstInteraction = () => {
      tryPlay()
      document.removeEventListener("pointerdown", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("pointerdown", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("pointerdown", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
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
