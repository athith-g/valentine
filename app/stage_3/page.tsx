"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PhraseSequence from "../components/phraseSequence";

const PHRASES = [
  "Dear Cassie,",
  "Valentine's day is coming up...",

];

const BPM = 110;
const BEAT_MS = 60000 / BPM;
const PULSE_MS = BEAT_MS * 2;
const TYPE_SPEED_MS = 70;
const PHRASE_GAP_MS = 2000;
const TEXT_FADE_MS = 600;

export default function Stage3() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`main-app ${isDarkBackground ? "bg-dark" : ""}`}>
      <PhraseSequence
        phrases={PHRASES}
        isEnabled
        startDelayMs={PULSE_MS * 2}
        typeSpeedMs={TYPE_SPEED_MS}
        phraseGapMs={PHRASE_GAP_MS}
        textFadeMs={TEXT_FADE_MS}
        buttonFadeMs={TEXT_FADE_MS}
        buttonLabel="View the question"
        onButtonComplete={() => {
          setIsDarkBackground(true);
          redirectTimeoutRef.current = window.setTimeout(() => {
            router.push("/uh-oh");
          }, 3000);
        }}
      />
    </div>
  );
}