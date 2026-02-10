"use client";

import { useEffect, useRef, useState } from "react";

export default function Congratulations() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
    return () => {
      if (audioFadeIntervalRef.current) {
        window.clearInterval(audioFadeIntervalRef.current);
      }
    };
  }, []);

  const fadeOutAudio = (durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const startVolume = audio.volume;
    const steps = Math.max(1, Math.floor(durationMs / 50));
    let currentStep = 0;

    if (audioFadeIntervalRef.current) {
      window.clearInterval(audioFadeIntervalRef.current);
    }

    audioFadeIntervalRef.current = window.setInterval(() => {
      currentStep += 1;
      const nextVolume = Math.max(
        0,
        startVolume * (1 - currentStep / steps)
      );
      audio.volume = nextVolume;

      if (currentStep >= steps) {
        audio.volume = 0;
        audio.pause();
        window.clearInterval(audioFadeIntervalRef.current!);
        audioFadeIntervalRef.current = null;
      }
    }, 50);
  };

  return (
    <div className={`main-app bg-dark ${isFadingOut ? "congrats--fade" : ""}`}>
      <div
        className="congratulations-content"
        onClick={() => {
          if (isFadingOut) {
            return;
          }
          setIsFadingOut(true);
          fadeOutAudio(1200);
          window.setTimeout(() => {
            window.location.href = "/question";
          }, 1200);
        }}
      >
        <audio ref={audioRef} src="/congrats.mp3" preload="auto" />
        <p className="uh-oh-text"> Evil Smiski has been defeated! He was too heartbroken to face you a final time. </p>
        <p className="uh-oh-text"> You can now rest easy knowing that he will never bother you again. </p>
        <p className="uh-oh-text"> Unfortunately, he stole all the website styling with him, which is why this page looks like shit. </p>
        <p className="uh-oh-text"> Click the button below. You won't regret it. Or maybe you will. Nah you probably won't. </p>
        <button
          onClick={(event) => {
            event.stopPropagation();
            window.location.href = "/question";
          }}
        >
          Go to the message.
        </button>
      </div>
    </div>
  );
}
