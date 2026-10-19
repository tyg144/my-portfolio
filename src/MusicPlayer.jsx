
import { useEffect, useRef } from "react"

export default function MusicPlayer() {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    const startMusic = () => {
      if (audio.paused) {
        audio.play().catch((error) => {
          console.log("Autoplay blocked:", error)
        })
      }
    }

    // Attempt autoplay when the website opens.
    startMusic()

    // Retry after the visitor interacts with the page.
    document.addEventListener("pointerdown", startMusic, { once: true })
    document.addEventListener("keydown", startMusic, { once: true })

    return () => {
      document.removeEventListener("pointerdown", startMusic)
      document.removeEventListener("keydown", startMusic)
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
