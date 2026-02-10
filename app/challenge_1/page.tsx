"use client";

import { useEffect, useRef, useState } from "react";
import ChallengeDirections from "../components/challengeDirections";
import Challenge1Game from "../challenges/challenge1";

export default function Challenge1() {
  const [challengeStarted, setChallengeStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeoutRef = useRef<number | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);
  const CHALLENGE_DIRECTIONS = {
    text: [
      "For this challenge, you will need to enter the correct date in order to unlock the next challenge.",
      "What's the date you ask?",
      "I'm evil. I don't give hints. Bad luck!",
    ],
    buttonText: "Start Challenge",
    onButtonClick: () => {
      setChallengeStarted(true);
      audioRef.current?.play().catch(() => {});
    },
  }

  useEffect(() => {
    return () => {
      if (audioTimeoutRef.current) {
        window.clearTimeout(audioTimeoutRef.current);
      }
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
    <div className="main-app bg-dark">
      <audio ref={audioRef} src="/jeopardy.mp3" preload="auto" />
      {challengeStarted ? (
        <div className="fade-in">
          <Challenge1Game onComplete={() => fadeOutAudio(1200)} />
        </div>
      ) : (
        <ChallengeDirections text={CHALLENGE_DIRECTIONS.text} buttonText={CHALLENGE_DIRECTIONS.buttonText} onButtonClick={CHALLENGE_DIRECTIONS.onButtonClick} />
      )}
    </div>
  );
}
