"use client";

import { useEffect, useState } from "react";
import EvilSmiskiDialog from "../components/evilSmiskiDialog";

export default function Challange3() {
  const [score, setScore] = useState(0);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [blueIndex, setBlueIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [disabledTiles, setDisabledTiles] = useState<Set<number>>(new Set());
  const [isGameActive, setIsGameActive] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!isGameActive) {
      return;
    }
    setIsMounted(true);
    let isActive = true;
    let showTimeoutId: number | null = null;
    let hideTimeoutId: number | null = null;

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

    triggerShow();

    return () => {
      isActive = false;
      if (showTimeoutId) {
        window.clearTimeout(showTimeoutId);
      }
      if (hideTimeoutId) {
        window.clearTimeout(hideTimeoutId);
      }
    };
  }, [isGameActive]);

  useEffect(() => {
    if (score < 5 || !isGameActive) {
      return;
    }

    setIsGameActive(false);
    setIsFadingOut(true);
    window.setTimeout(() => {
      setShowDialog(true);
    }, 600);
  }, [score, isGameActive]);

  return (
    <div className="main-app bg-dark challenge-2">
      <div className={`challenge-2__content ${isFadingOut ? "challenge-2--fade" : ""}`}>
        <div className="challenge__directions challenge-3__directions">
          <p>Click the smiski head to gain points. You lose points if you click your friends. 5 points to move on.</p>
          <p className="challenge-3__score">Score: {score}</p>
        </div>
        <div className="challenge-2__game">
          <div className="challenge-3__tiles">
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
            "You did it...",
            "But I'm not done yet.",
            "Prepare for the next challenge!",
          ]}
          isActive={showDialog}
        />
      </div>
    </div>
  );
}
