"use client";

import { useEffect, useRef, useState } from "react";
import EvilSmiskiDialog from "../components/evilSmiskiDialog";
import ChallengeDirections from "../components/challengeDirections";

export default function Challenge3() {
  const [score, setScore] = useState(0);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [blueIndex, setBlueIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [disabledTiles, setDisabledTiles] = useState<Set<number>>(new Set());
  const [isGameActive, setIsGameActive] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    if (!isGameActive) {
      return;
    }
    setIsMounted(true);
    let isActive = true;
    let showTimeoutId: number | null = null;
    let hideTimeoutId: number | null = null;
    let startDelayId: number | null = null;

    const scheduleHiddenGap = () => {
      if (!isActive) {
        return;
      }
      const gapMs = 2000 + Math.random() * 2000;
      showTimeoutId = window.setTimeout(triggerShow, gapMs);
    };

    const triggerShow = () => {
      if (!isActive) {
        return;
      }
      setIsFlashOn(true);
      setDisabledTiles(new Set());
      setBlueIndex(Math.floor(Math.random() * 9));
      hideTimeoutId = window.setTimeout(() => {
        setIsFlashOn(false);
        scheduleHiddenGap();
      }, 700);
    };

    startDelayId = window.setTimeout(() => {
      if (!isActive) {
        return;
      }
      setIsFlashOn(true);
      setDisabledTiles(new Set());
      setBlueIndex(Math.floor(Math.random() * 9));
      hideTimeoutId = window.setTimeout(() => {
        setIsFlashOn(false);
        scheduleHiddenGap();
      }, 700);
    }, 3000);

    return () => {
      isActive = false;
      if (showTimeoutId) {
        window.clearTimeout(showTimeoutId);
      }
      if (hideTimeoutId) {
        window.clearTimeout(hideTimeoutId);
      }
      if (startDelayId) {
        window.clearTimeout(startDelayId);
      }
    };
  }, [isGameActive]);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
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

  useEffect(() => {
    if (score < 5 || !isGameActive) {
      return;
    }

    setIsGameActive(false);
    fadeOutAudio(1200);
    setIsFadingOut(true);
    window.setTimeout(() => {
      setShowDialog(true);
    }, 600);
  }, [score, isGameActive]);

  return (
    <div className="main-app bg-dark challenge-2">
      <audio ref={audioRef} src="/speed.mp3" preload="auto" />
      <div className={`challenge-2__content ${isFadingOut ? "challenge-2--fade" : ""}`}>
        <div className="challenge__directions challenge-3__directions challenge-2__fade">
          <p>Click the smiski head to gain points. You lose points if you click yourself . 5 points to move on.</p>
          <p className="challenge-3__score">Score: {score}</p>
        </div>
        <div className="challenge-2__game challenge-2__fade">
          <div className="challenge-3__tiles challenge-2__fade">
            {Array.from({ length: 9 }).map((_, index) => {
              const isBlue = isMounted && index === blueIndex;
              const isDisabled = disabledTiles.has(index);
              const faceNumber = index < blueIndex ? index + 1 : index;
              const imgSrc = isBlue
                ? "/face_pics/9.png"
                : `/face_pics/${faceNumber}.png`;
              return (
                <button
                  key={index}
                  type="button"
                  className={`challenge-3__tile ${
                    isFlashOn ? "challenge-3__tile--flash" : "challenge-3__tile--hidden"
                  } ${isBlue ? "challenge-3__tile--blue" : ""} ${
                    isDisabled ? "challenge-3__tile--disabled" : ""
                  }`}
                  onClick={() => {
                    if (!isFlashOn || isDisabled) {
                      return;
                    }
                    setScore((prev) => prev + (isBlue ? 1 : -1));
                    setDisabledTiles((prev) => {
                      const next = new Set(prev);
                      next.add(index);
                      return next;
                    });
                  }}
                >
                  <img className="challenge-3__tile-image" src={imgSrc} alt="Face" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="challenge-2__overlay">
        <EvilSmiskiDialog
          phrases={[
            "You're FAST!!!",
            "Kind of like how your boyfriend is fast in...",
            "sports....",
            "hehehe.....",
            "Well,",
            "You've proven you have a good memory...",
            "You've proven you're fast...",
            "But the question is...",
            "Are you SMART??",
            "This last challenge will push your tiny brain to the limit",
            "And remember,",
            "If you fail...",
            "You're MINE!!!!!"
          ]}
          isActive={showDialog}
          onComplete={() => {
            setShowDirections(true);
          }}
        />
        {showDirections && (
          <div className="fade-in">
            <ChallengeDirections
              text={[
                "I've kidnapped your boyfriend and trapped him on Roosevelt Island with two very special guests.",
                "You can only carry one person back at a time, so be careful who you leave behind...",
                ""
              ]}
              buttonText="Next challenge"
              onButtonClick={() => {
                window.location.href = "/challenge_4";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
