"use client";

import { useEffect, useMemo, useState } from "react";
import EvilSmiskiDialog from "../components/evilSmiskiDialog";
import ChallengeDirections from "../components/challengeDirections";

export default function Challenge2Game() {
  const tiles = useMemo(() => {
    const base = [
      "/tile_pics/1.png",
      "/tile_pics/2.png",
      "/tile_pics/3.png",
      "/tile_pics/4.png",
      "/tile_pics/5.png",
      "/tile_pics/6.svg",
    ];
    return [...base, ...base];
  }, []);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<Set<number>>(new Set());
  const [isLocked, setIsLocked] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handleTileClick = (index: number) => {
    if (isLocked || matchedTiles.has(index) || flippedTiles.includes(index)) {
      return;
    }

    const nextFlipped = [...flippedTiles, index];
    setFlippedTiles(nextFlipped);

    if (nextFlipped.length === 2) {
      const [first, second] = nextFlipped;
      const isMatch = tiles[first] === tiles[second];
      if (isMatch) {
        setMatchedTiles((prev) => new Set(prev).add(first).add(second));
        setFlippedTiles([]);
      } else {
        setIsLocked(true);
        window.setTimeout(() => {
          setFlippedTiles([]);
          setIsLocked(false);
        }, 700);
      }
    }
  };

  useEffect(() => {
    if (matchedTiles.size !== tiles.length || isFadingOut) {
      return;
    }

    setIsFadingOut(true);
    window.setTimeout(() => {
      setShowDialog(true);
    }, 600);
  }, [matchedTiles.size, tiles.length, isFadingOut]);

  return (
    <div className="main-app bg-dark challenge-2">
      <div className={`challenge-2__content ${isFadingOut ? "challenge-2--fade" : ""}`}>
        <div className="challenge__directions">
          <p>Click the tile to flip it. Find all the matching tiles.</p>
        </div>
        <div className="challenge-2__game">
          <div className="challenge-2__tiles">
            {Array.from({ length: 12 }).map((_, index) => {
              const isFlipped =
                flippedTiles.includes(index) || matchedTiles.has(index);
              return (
                <button
                  key={index}
                  type="button"
                  className={`challenge-2__tile ${
                    isFlipped ? "challenge-2__tile--flipped" : ""
                  }`}
                  onClick={() => handleTileClick(index)}
                  aria-pressed={isFlipped}
                >
                  <div className="challenge-2__tile-inner">
                    <div className="challenge-2__tile-face challenge-2__tile-front" />
                    <div className="challenge-2__tile-face challenge-2__tile-back">
                      <img
                        className="challenge-2__tile-image"
                        src={tiles[index]}
                        alt="Tile"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="challenge-2__overlay">
        <EvilSmiskiDialog
          phrases={[
            "This idiot said she had a bad memory...",
            "I can't get this guy to do anything right...",
            "I'm getting a little nervous...",
            "HEY! WERE YOU LISTENING???",
            "YOU DIDN'T HEAR ANY OF THAT OKAY?!?",
            "Arghh......",
            "You've forced my hand!",
            "It's time to up the ante!",
            "Let's see if you have the SPEED to be your idiot's valentine!"
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
                "Challenge 3 awaits.",
                "The rules will be revealed soon.",
                "Get ready for the next test.",
              ]}
              buttonText="Next challenge"
              onButtonClick={() => {
                window.location.href = "/challange_3";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}