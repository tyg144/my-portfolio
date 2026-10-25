
import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playlist = [
      "/newmusic.mp3",
      "/portfolio.mp3",
    ];

    let currentTrack = 0;
    audio.volume = currentTrack === 0 ? 0.20 : 0.35;
    audio.src = playlist[currentTrack];

    const playMusic = () => {
      audio.play().catch((error) => {
        console.log("Music playback blocked:", error);
      });
    };

    const playNextTrack = () => {
      currentTrack = (currentTrack + 1) % playlist.length;
      audio.src = playlist[currentTrack];
      audio.volume = currentTrack === 0 ? 0.20 : 0.35;
      playMusic();
    };

    audio.addEventListener("ended", playNextTrack);

    playMusic();

    document.addEventListener("pointerdown", playMusic, {
      once: true,
    });

    document.addEventListener("keydown", playMusic, {
      once: true,
    });

    return () => {
      audio.removeEventListener("ended", playNextTrack);
      document.removeEventListener("pointerdown", playMusic);
      document.removeEventListener("keydown", playMusic);
    };
  }, []);

  return <audio ref={audioRef} preload="auto" />;
}
