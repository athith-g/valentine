"use client";

import { useEffect, useRef, useState } from "react";
import EvilTypeText from "./evilTypeText";
import PhraseSequence from "./phraseSequence";

type EvilSmiskiDialogProps = {
  phrases: string[];
  isActive: boolean;
  onComplete?: () => void;
};

const TYPE_SPEED_MS = 60;
const PHRASE_GAP_MS = 1200;
const TEXT_FADE_MS = 500;
const SMISKI_EXIT_MS = 900;

export default function EvilSmiskiDialog({
  phrases,
  isActive,
  onComplete,
}: EvilSmiskiDialogProps) {
  const [showSmiski, setShowSmiski] = useState(false);
  const [isSmiskiRising, setIsSmiskiRising] = useState(false);
  const [isSmiskiExiting, setIsSmiskiExiting] = useState(false);
  const [showText, setShowText] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setShowSmiski(false);
      setIsSmiskiRising(false);
      setIsSmiskiExiting(false);
      setShowText(false);
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
      return;
    }

    setShowText(true);
    setShowSmiski(true);
    window.requestAnimationFrame(() => {
      setIsSmiskiRising(true);
    });
  }, [isActive]);

  return (
    <>
      {showText && (
        <div className="evil-text-wrapper">
          <PhraseSequence
            phrases={phrases}
            isEnabled
            startDelayMs={0}
            typeSpeedMs={TYPE_SPEED_MS}
            phraseGapMs={PHRASE_GAP_MS}
            textFadeMs={TEXT_FADE_MS}
            buttonFadeMs={TEXT_FADE_MS}
            buttonLabel=" "
            TextComponent={EvilTypeText}
            showButton={false}
            onSequenceEnd={() => {
              setIsSmiskiExiting(true);
              exitTimeoutRef.current = window.setTimeout(() => {
                setShowText(false);
                setShowSmiski(false);
                onComplete?.();
              }, Math.max(TEXT_FADE_MS, SMISKI_EXIT_MS));
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
    </>
  );
}
