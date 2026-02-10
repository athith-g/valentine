"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PhraseSequence from "../components/phraseSequence";
import { PERSONAL_PIC_PLACEMENTS } from "../utils/personalPics";

const PERSONAL_PICS = [
  "/personal_pics/1.jpg",
  "/personal_pics/2.jpeg",
  "/personal_pics/3.jpeg",
  "/personal_pics/4.jpeg",
  "/personal_pics/5.JPG",
  "/personal_pics/6.jpeg",
  "/personal_pics/7.JPG",
  "/personal_pics/8.jpeg",
  "/personal_pics/9.jpeg",
  "/personal_pics/10.JPEG",
  "/personal_pics/11.jpeg",
  "/personal_pics/12.jpeg",
  "/personal_pics/13.jpeg",
  "/personal_pics/14.jpeg",
  "/personal_pics/15.jpeg",
  "/personal_pics/16.JPEG",
];

const BPM = 110;
const BEAT_MS = 60000 / BPM;
const PULSE_MS = BEAT_MS * 2;
const PICTURE_DELAY_BEATS = 18;
const PICTURE_DELAY_MS = (PICTURE_DELAY_BEATS - 1) * BEAT_MS;
const TYPE_SPEED_MS = 70;
const PHRASE_GAP_MS = 2000;
const TEXT_FADE_MS = 600;
const QUESTION_FADE_MS = 800;

const PHRASES = [
  "Dear Cassie,",
  "Valentine's day is coming up...",
  "And since you're the...",
  "PRETTIEST",
  "SMARTEST",
  "LOVELIEST",
  "FUNNIEST",
  "MOST THOUGHTFUL",
  "MOST MYSTERIOUS",
  "MOST AURA-HAVING",
  "Girlfriend in the world...",
  "I wanted to ask you a question..."
];

type PositionedPic = {
  id: number;
  src: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
};

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const pulseIntervalRef = useRef<number | null>(null);
  const stageTimeoutRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);
  const nextPicIndexRef = useRef(0);
  const nextPicIdRef = useRef(0);
  const aspectRatiosRef = useRef<Record<string, number>>({});
  const [isShrinking, setIsShrinking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isBeatActive, setIsBeatActive] = useState(false);
  const [pics, setPics] = useState<PositionedPic[]>([]);
  const [stage, setStage] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isQuestionFading, setIsQuestionFading] = useState(false);
  const [showSephora, setShowSephora] = useState(false);

  useEffect(() => {
    PERSONAL_PICS.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.naturalWidth > 0) {
          aspectRatiosRef.current[src] = img.naturalHeight / img.naturalWidth;
        }
      };
      img.src = src;
    });

    return () => {
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
      if (pulseIntervalRef.current) {
        window.clearInterval(pulseIntervalRef.current);
      }
      if (stageTimeoutRef.current) {
        window.clearTimeout(stageTimeoutRef.current);
      }
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
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

  const addNextPicture = () => {
    const index = nextPicIndexRef.current;
    if (index >= PERSONAL_PICS.length) {
      if (pulseIntervalRef.current) {
        window.clearInterval(pulseIntervalRef.current);
      }
      return;
    }

    const placement = PERSONAL_PIC_PLACEMENTS[index];
    nextPicIndexRef.current = index + 1;
    const src = PERSONAL_PICS[index];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = placement?.width ?? 200;
    const aspectRatio = aspectRatiosRef.current[src] ?? 1;
    const height = Math.round(width * aspectRatio);
    const padding = 16;
    const maxLeft = Math.max(padding, viewportWidth - width - padding);
    const maxTop = Math.max(padding, viewportHeight - height - padding);
    const leftPercent = placement?.left ?? 10;
    const topPercent = placement?.top ?? 10;
    const left = Math.min(
      Math.max(padding, Math.round((leftPercent / 100) * viewportWidth)),
      maxLeft
    );
    const top = Math.min(
      Math.max(padding, Math.round((topPercent / 100) * viewportHeight)),
      maxTop
    );

    setPics((prev) => [
      ...prev,
      {
        id: nextPicIdRef.current++,
        src,
        left,
        top,
        width,
        height,
        zIndex: index,
      },
    ]);

    if (index === PERSONAL_PICS.length - 1) {
      stageTimeoutRef.current = window.setTimeout(() => {
        setStage(2);
      }, PULSE_MS * 2);
    }
  };

  const handleLetterClick = () => {
    if (isShrinking) {
      return;
    }

    setIsShrinking(true);
    setStage(1);

    window.setTimeout(() => {
      setIsHidden(true);
      setIsBeatActive(true);
      audioRef.current?.play().catch(() => {});

      pulseTimeoutRef.current = window.setTimeout(() => {
        addNextPicture();
        pulseIntervalRef.current = window.setInterval(
          addNextPicture,
          PULSE_MS * 2
        );
      }, PICTURE_DELAY_MS);
    }, 450);
  };

  const handleAnswerClick = () => {
    if (isQuestionFading || showSephora) {
      return;
    }

    setIsQuestionFading(true);
    window.setTimeout(() => {
      setShowQuestion(false);
      setShowSephora(true);
    }, QUESTION_FADE_MS);
  };

  return (
    <div className={`main-app ${isBeatActive && stage < 2 ? "bg-beat" : ""}`}>
      <div className={isQuestionFading ? "question-fade-out" : ""}>
        <audio ref={audioRef} src="/song.mp3" preload="auto" />
        {pics.map((pic) => (
          <img
            key={pic.id}
            className={`personal-pic pic-fade-in ${
              stage >= 2 ? "pic-fade-out" : ""
            }`}
            src={pic.src}
            alt="Personal memory"
            style={{
              top: `${pic.top}px`,
              left: `${pic.left}px`,
              width: `${pic.width}px`,
              height: `${pic.height}px`,
              zIndex: pic.zIndex,
            }}
          />
        ))}
        <div className="question-phrases">
          <PhraseSequence
            phrases={PHRASES}
            isEnabled={stage >= 2}
            startDelayMs={PULSE_MS * 2}
            typeSpeedMs={TYPE_SPEED_MS}
            phraseGapMs={PHRASE_GAP_MS}
            textFadeMs={TEXT_FADE_MS}
            buttonFadeMs={TEXT_FADE_MS}
            buttonLabel="View the question"
            showButton={false}
            onSequenceEnd={() => {
              redirectTimeoutRef.current = window.setTimeout(() => {
                setShowQuestion(true);
              }, TEXT_FADE_MS);
            }}
          />
        </div>
        {showQuestion && (
          <div className="question-card fade-in">
            <h1 className="question-title">Will you be my valentine?</h1>
            <button
              className="question-button question-button--blue"
              type="button"
              onClick={handleAnswerClick}
            >
              Yes
            </button>
            <button
              className="question-button question-button--red"
              type="button"
              onClick={handleAnswerClick}
            >
              Yes, but in Blue
            </button>
          </div>
        )}
        {!isHidden && (
          <Image
            className={`letter-pulse ${isShrinking ? "letter-shrink" : ""}`}
            src="/letter.png"
            alt="Letter"
            priority
            width={200}
            height={140}
            onClick={handleLetterClick}
          />
        )}
      </div>
      {showSephora && (
        <div className="sephora-card sephora-fade-in">
          <img className="sephora-image" src="/sephora.jpeg" alt="Sephora" />
          <p className="sephora-caption">
            Thanks for playing! Check your inbox on Saturday 😉
          </p>
        </div>
      )}
    </div>
  );
}
