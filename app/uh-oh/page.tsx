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
  const hideTimeoutRef = useRef<number | null>(null);
  const [showText, setShowText] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [isImageFading, setIsImageFading] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(false);
  const [isAcceptFading, setIsAcceptFading] = useState(false);
  const acceptTimeoutRef = useRef<number | null>(null);
  const ACCEPT_FADE_MS = 900;

  useEffect(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowText(false);
      setShowImage(true);
    }, 3000);

    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      if (acceptTimeoutRef.current) {
        window.clearTimeout(acceptTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="main-app bg-dark">
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
            if (isAcceptFading) {
              return;
            }
            setIsAcceptFading(true);
            acceptTimeoutRef.current = window.setTimeout(() => {
              window.location.href = "/challenge_1";
            }, ACCEPT_FADE_MS);
          }}
        >
          Accept the challenge
        </button>
      )}
    </div>
  );
}
