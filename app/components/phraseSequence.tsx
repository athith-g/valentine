"use client";

import { useEffect, useRef, useState } from "react";
import TypeText from "./typeText";

type PhraseSequenceProps = {
  phrases: string[];
  isEnabled: boolean;
  startDelayMs: number;
  typeSpeedMs: number;
  phraseGapMs: number;
  textFadeMs: number;
  buttonFadeMs: number;
  buttonLabel: string;
  onButtonComplete?: () => void;
  TextComponent?: React.ComponentType<{ text: string; speedMs?: number }>;
  loopPhrases?: boolean;
  showButton?: boolean;
  onSequenceEnd?: () => void;
};

export default function PhraseSequence({
  phrases,
  isEnabled,
  startDelayMs,
  typeSpeedMs,
  phraseGapMs,
  textFadeMs,
  buttonFadeMs,
  buttonLabel,
  onButtonComplete,
  TextComponent = TypeText,
  loopPhrases = false,
  showButton: shouldShowButton = true,
  onSequenceEnd,
}: PhraseSequenceProps) {
  const startTimeoutRef = useRef<number | null>(null);
  const phraseTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const buttonTimeoutRef = useRef<number | null>(null);
  const wasEnabledRef = useRef(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTextFading, setIsTextFading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isButtonFading, setIsButtonFading] = useState(false);

  const clearAllTimeouts = () => {
    if (startTimeoutRef.current) {
      window.clearTimeout(startTimeoutRef.current);
    }
    if (phraseTimeoutRef.current) {
      window.clearTimeout(phraseTimeoutRef.current);
    }
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
    }
    if (buttonTimeoutRef.current) {
      window.clearTimeout(buttonTimeoutRef.current);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      clearAllTimeouts();
      setPhraseIndex(0);
      setIsActive(false);
      setIsTextFading(false);
      setShowButton(false);
      setIsButtonFading(false);
      wasEnabledRef.current = false;
      return;
    }

    if (!wasEnabledRef.current) {
      setPhraseIndex(0);
      setIsTextFading(false);
      setShowButton(false);
      setIsButtonFading(false);

      if (startDelayMs <= 0) {
        setIsActive(true);
        setPhraseIndex(0);
      } else {
        startTimeoutRef.current = window.setTimeout(() => {
          setIsActive(true);
          setPhraseIndex(0);
        }, startDelayMs);
      }

      wasEnabledRef.current = true;
    }

    return () => {
      clearAllTimeouts();
    };
  }, [isEnabled, startDelayMs]);

  useEffect(() => {
    if (!isActive || phrases.length === 0) {
      return;
    }

    const phrase = phrases[phraseIndex];
    const typingDuration = phrase.length * typeSpeedMs;
    if (loopPhrases) {
      phraseTimeoutRef.current = window.setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, typingDuration + phraseGapMs);

      return () => {
        if (phraseTimeoutRef.current) {
          window.clearTimeout(phraseTimeoutRef.current);
        }
      };
    }

    const isLastPhrase = phraseIndex === phrases.length - 1;
    const nextStepDelay = typingDuration + phraseGapMs;

    if (isLastPhrase) {
      fadeTimeoutRef.current = window.setTimeout(() => {
        setIsTextFading(true);
        onSequenceEnd?.();
        if (shouldShowButton) {
          buttonTimeoutRef.current = window.setTimeout(() => {
            setShowButton(true);
          }, textFadeMs);
        }
      }, nextStepDelay);
      return () => {
        if (fadeTimeoutRef.current) {
          window.clearTimeout(fadeTimeoutRef.current);
        }
        if (buttonTimeoutRef.current) {
          window.clearTimeout(buttonTimeoutRef.current);
        }
      };
    }

    phraseTimeoutRef.current = window.setTimeout(() => {
      setPhraseIndex((prev) => prev + 1);
    }, nextStepDelay);

    return () => {
      if (phraseTimeoutRef.current) {
        window.clearTimeout(phraseTimeoutRef.current);
      }
    };
  }, [isActive, phraseIndex, phrases, phraseGapMs, textFadeMs, typeSpeedMs]);

  return (
    <>
      {isActive && (
        <div className={`type-text-wrapper ${isTextFading ? "type-text--fade" : ""}`}>
          <TextComponent text={phrases[phraseIndex]} speedMs={typeSpeedMs} />
        </div>
      )}
      {showButton && (
        <button
          className={`stage-button stage-button--show ${
            isButtonFading ? "stage-button--hide" : ""
          }`}
          type="button"
          onClick={() => {
            setIsButtonFading(true);
            buttonTimeoutRef.current = window.setTimeout(() => {
              setShowButton(false);
              onButtonComplete?.();
            }, buttonFadeMs);
          }}
        >
          {buttonLabel}
        </button>
      )}
    </>
  );
}
