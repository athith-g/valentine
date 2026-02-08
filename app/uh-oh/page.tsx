"use client";

import { useEffect, useRef, useState } from "react";
import EvilSmiskiDialog from "../components/evilSmiskiDialog";

const EVIL_PHRASES = [
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "IT'S ME",
  "EVIL SMISKI!!!!",
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH", 
  "I know Seattle Guy has a question for you...",
  "But I want you all to MYSELF!",
  "I might be too small to kidnap you...",
  "But I can still make you mine...",
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "If you want to be Seattle Guy's valentine,",
  "You'll have to solve my puzzles!",
  "If you don't...",
  "YOU WILL BE MINE FOREVER!",
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "HAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "*cough* *cough* *cough*",
  "God my throat hurts..."
];

export default function UhOh() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [showText, setShowText] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [isImageFading, setIsImageFading] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(false);
  const [isAcceptFading, setIsAcceptFading] = useState(false);
  const [isAudioFading, setIsAudioFading] = useState(false);
  const audioFadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowText(false);
      setShowImage(true);
    }, 3000);

    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      if (audioFadeIntervalRef.current) {
        window.clearInterval(audioFadeIntervalRef.current);
      }
    };
  }, []);

  const fadeOutAudio = (durationMs: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      onComplete?.();
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
        onComplete?.();
      }
    }, 50);
  };

  return (
    <div className="main-app bg-dark">
      <audio ref={audioRef} src="/evil.mp3" preload="auto" />
      {showText && <p className="uh-oh-text">Uh oh...</p>}
      {showImage && !hideImage && (
        <img
          className={`evil-letter ${
            isImageFading ? "evil-letter--fade" : "evil-letter--animate"
          }`}
          src="/evil_letter.png"
          alt="Evil letter"
          onClick={() => {
            setIsImageFading(true);
            const audio = audioRef.current;
            if (audio) {
              audio.currentTime = 0;
              audio.play().catch(() => {});
            }
            setShowDialog(true);
            window.setTimeout(() => {
              setHideImage(true);
            }, 600);
          }}
        />
      )}
      <EvilSmiskiDialog
        phrases={EVIL_PHRASES}
        isActive={showDialog}
        onComplete={() => {
          setShowAcceptButton(true);
        }}
      />
      {showAcceptButton && (
        <button
          className={`stage-button stage-button--show ${
            isAcceptFading ? "stage-button--hide" : ""
          }`}
          type="button"
          onClick={() => {
            if (isAcceptFading || isAudioFading) {
              return;
            }
            setIsAcceptFading(true);
            setIsAudioFading(true);
            fadeOutAudio(900, () => {
              window.location.href = "/challenge_1";
            });
          }}
        >
          Accept the challenge
        </button>
      )}
    </div>
  );
}
