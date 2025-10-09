"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/Jingle-Bells-3(chosic.com).mp3";

/**
 * Lightweight festive music controller with accessible play/pause toggle.
 * Attempts a single polite autoplay; falls back to manual control when blocked.
 */
export default function ChristmasMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.autoplay = true;
    audio.preload = "auto";
    audio.volume = 0.35;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError("Festive music is unavailable right now.");

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    const handleVisibility = () => {
      if (document.hidden && !audio.paused) {
        audio.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    audio
      .play()
      .then(() => {
        setAutoplayBlocked(false);
        setError(null);
      })
      .catch(() => {
        setAutoplayBlocked(true);
        audio.pause();
      });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      setError("Festive music is still loading. Please try again.");
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setAutoplayBlocked(false);
        setError(null);
      } catch {
        setError("Your browser blocked playback—please allow audio and try again.");
      }
    } else {
      audio.pause();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <button
        type="button"
        onClick={togglePlayback}
        className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
        aria-pressed={isPlaying}
      >
        <span aria-hidden="true" role="img">
          {isPlaying ? "⏸️" : "🎶"}
        </span>
        {isPlaying ? "Pause Christmas music" : "Play Christmas music"}
      </button>
      <p className="text-xs text-white/80" aria-live="polite">
        {error
          ? error
          : autoplayBlocked && !isPlaying
            ? "Press play to hear the Christmas music."
            : isPlaying
              ? "Christmas music is playing."
              : "Starting music..."}
      </p>
      <p className="text-[11px] text-white/60">
        Track: “Jingle Bells” by Kevin MacLeod (CC BY 3.0) via{" "}
        <a
          href="https://www.chosic.com/free-music/all/"
          className="underline text-white/80 hover:text-white"
        >
          Chosic
        </a>
      </p>
    </div>
  );
}
