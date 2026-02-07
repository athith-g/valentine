"use client";

import { useEffect, useRef, useState } from "react";
import EvilTypeText from "../components/evilTypeText";
import PhraseSequence from "../components/phraseSequence";

const EVIL_TYPE_SPEED_MS = 60;
const EVIL_PHRASE_GAP_MS = 2000;
const EVIL_TEXT_FADE_MS = 500;
const SMISKI_EXIT_MS = 900;

const EVIL_PHRASES = [
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "IT'S ME",
  "EVIL SMISKI!!!!",
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH", 
  "I know Seattle guy has a question for you...",
  "But I want you all to MYSELF!",
  "I might be too small to kidnap you...",
  "But I can still make you mine...",
  "MWAHAH AHAHAHAH AHAHAHAH AHAHAHAH",
  "If you want to be Seatte guy's valentine,",
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
  const [showSmiski, setShowSmiski] = useState(false);
  const [isSmiskiRising, setIsSmiskiRising] = useState(false);
  const [isSmiskiExiting, setIsSmiskiExiting] = useState(false);
  const [showEvilText, setShowEvilText] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(false);

  useEffect(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowText(false);
      setShowImage(true);
    }, 3000);

    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

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
            setShowEvilText(true);
            setShowSmiski(true);
            window.requestAnimationFrame(() => {
              setIsSmiskiRising(true);
            });
            window.setTimeout(() => {
              setHideImage(true);
            }, 600);
          }}
        />
      )}
      {showEvilText && (
        <div className="evil-text-wrapper">
          <PhraseSequence
            phrases={EVIL_PHRASES}
            isEnabled
            startDelayMs={0}
            typeSpeedMs={EVIL_TYPE_SPEED_MS}
            phraseGapMs={EVIL_PHRASE_GAP_MS}
            textFadeMs={EVIL_TEXT_FADE_MS}
            buttonFadeMs={EVIL_TEXT_FADE_MS}
            buttonLabel=" "
            TextComponent={EvilTypeText}
            showButton={false}
            onSequenceEnd={() => {
              setIsSmiskiExiting(true);
              window.setTimeout(() => {
                setShowAcceptButton(true);
              }, Math.max(EVIL_TEXT_FADE_MS, SMISKI_EXIT_MS));
            }}
          />
        </div>
      )}
      {showSmiski && (
        <img
          className={`evil-smiski ${
            isSmiskiExiting
              ? "evil-smiski--exit"
              : isSmiskiRising
                ? "evil-smiski--rise"
                : ""
          }`}
          src="/evil_smiski.png"
          alt="Evil smiski"
        />
      )}
      {showAcceptButton && (
        <button className="stage-button stage-button--show" type="button">
          Accept the challenge
        </button>
      )}
    </div>
  );
}
