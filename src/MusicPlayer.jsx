
import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.35;

    const playMusic = () => {
      audio.play().catch((error) => {
        console.log("Music playback blocked:", error);
      });
    };

    // Try autoplay when the website loads.
    playMusic();

    // Retry after the visitor interacts with the website.
    document.addEventListener("pointerdown", playMusic, {
      once: true,
    });

    document.addEventListener("keydown", playMusic, {
      once: true,
    });

    return () => {
      document.removeEventListener("pointerdown", playMusic);
      document.removeEventListener("keydown", playMusic);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/portfolio.mp3"
      autoPlay
      loop
      preload="auto"
    />
  );
}
