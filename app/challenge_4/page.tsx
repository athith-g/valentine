"use client";

import { useEffect, useRef, useState } from "react";

export default function Challenge4Game() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showTram, setShowTram] = useState(false);
  const [isAtRoosevelt, setIsAtRoosevelt] = useState(false);
  const [rooseveltPeople, setRooseveltPeople] = useState<string[]>([]);
  const [manhattanPeople, setManhattanPeople] = useState<string[]>([
    "Athith",
    "Jesus",
    "Skyelar",
  ]);
  const [tramDirection, setTramDirection] = useState<"toRoosevelt" | "toManhattan">("toRoosevelt");
  const [hasLost, setHasLost] = useState(false);
  const [lossReason, setLossReason] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);

  const handlePersonClick = (person: string) => {
    setSelectedPerson(person);
  };

  const getLossReason = (people: string[]) => {
    if (people.includes("Athith") && people.includes("Skyelar")) {
      return "You left Athith and Skyelar alone together. Skyelar kept talking about her purse collection. Once she started talking about purse #672, Athith had enough and climbed atop the Roosevelt Bridge so that he could jump off of it.";
    }
    if (people.includes("Jesus") && people.includes("Skyelar")) {
      return "You left Jesus and Skyelar alone together. She kept making fun of him because his sandles weren't Gucci. He decided to nail himself to a cross.";
    }
    return null;
  };

  const resetGame = () => {
    setSelectedPerson(null);
    setIsFadingOut(false);
    setShowTram(false);
    setIsAtRoosevelt(false);
    setRooseveltPeople([]);
    setManhattanPeople(["Athith", "Jesus", "Skyelar"]);
    setTramDirection("toRoosevelt");
    setHasLost(false);
    setLossReason(null);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

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
    audioRef.current?.play().catch(() => {});
    return () => {
      if (audioFadeIntervalRef.current) {
        window.clearInterval(audioFadeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="main-app bg-dark challenge-2">
      <audio ref={audioRef} src="/drake.mp3" preload="auto" />
      <div className={`challenge-2__content challenge-4__content ${isFadingOut ? "challenge-4__fade" : ""}`}>
        <div className="challenge__directions challenge-2__fade">
          <p>
            {isAtRoosevelt
              ? "Choose who you want to bring to Manhattan. Don't leave the wrong people alone."
              : "Choose who you want to bring to Roosevelt Island. Don't leave the wrong people alone."}
          </p>
        </div>
        <div className="challenge-2__game challenge-2__fade">
          <div className="challenge-4__triangle">
            {selectedPerson && (
              <button
                className="challenge-4__button"
                type="button"
                onClick={() => {
                  if (isFadingOut) {
                    return;
                  }
                  if (!isAtRoosevelt) {
                    setRooseveltPeople((prev) =>
                      prev.includes(selectedPerson) ? prev : [...prev, selectedPerson]
                    );
                    setManhattanPeople((prev) =>
                      prev.filter((person) => person !== selectedPerson)
                    );
                  const nextRoosevelt = rooseveltPeople.includes(selectedPerson)
                    ? rooseveltPeople
                    : [...rooseveltPeople, selectedPerson];
                  const nextManhattan = manhattanPeople.filter(
                    (person) => person !== selectedPerson
                  );
                    setTramDirection("toRoosevelt");
                    setIsFadingOut(true);
                    window.setTimeout(() => {
                      setShowTram(true);
                      window.setTimeout(() => {
                        setShowTram(false);
                        setIsFadingOut(false);
                        setIsAtRoosevelt(true);
                        setSelectedPerson(null);
                        if (nextRoosevelt.length === 3) {
                          setIsFadingOut(true);
                          fadeOutAudio(1200);
                          window.setTimeout(() => {
                            window.location.href = "/congratulations";
                          }, 600);
                          return;
                        }
                        const lossMessage = getLossReason(nextManhattan);
                        if (lossMessage) {
                          setLossReason(lossMessage);
                          setHasLost(true);
                        }
                      }, 4500);
                    }, 600);
                  } else {
                    setTramDirection("toManhattan");
                    setIsFadingOut(true);
                    window.setTimeout(() => {
                      setShowTram(true);
                      window.setTimeout(() => {
                        setShowTram(false);
                        setIsFadingOut(false);
                        setIsAtRoosevelt(false);
                        if (selectedPerson && selectedPerson !== "Nobody") {
                          setManhattanPeople((prev) =>
                            prev.includes(selectedPerson) ? prev : [...prev, selectedPerson]
                          );
                          setRooseveltPeople((prev) =>
                            prev.filter((person) => person !== selectedPerson)
                          );
                        }
                        const nextRoosevelt =
                          selectedPerson && selectedPerson !== "Nobody"
                            ? rooseveltPeople.filter((person) => person !== selectedPerson)
                            : rooseveltPeople;
                        const lossMessage = getLossReason(nextRoosevelt);
                        if (lossMessage) {
                          setLossReason(lossMessage);
                          setHasLost(true);
                        }
                        setSelectedPerson(null);
                      }, 4500);
                    }, 600);
                  }
                }}
              >
                {isAtRoosevelt
                  ? selectedPerson === "Nobody"
                    ? "Bring nobody back to manhattan"
                    : `Bring ${selectedPerson} back to manhattan`
                  : `Click to bring ${selectedPerson} to roosevelt island`}
              </button>
            )}
            {!isAtRoosevelt && (
              <>
                {manhattanPeople.includes("Athith") && (
                  <img
                    className={`challenge-4__face challenge-4__face--top ${
                      selectedPerson === "Athith" ? "challenge-4__face--selected" : ""
                    }`}
                    src="/c4_faces/athith.png"
                    alt="Athith"
                    onClick={() => handlePersonClick("Athith")}
                  />
                )}
                {manhattanPeople.includes("Jesus") && (
                  <img
                    className={`challenge-4__face challenge-4__face--left ${
                      selectedPerson === "Jesus" ? "challenge-4__face--selected" : ""
                    }`}
                    src="/c4_faces/jesus.png"
                    alt="Jesus"
                    onClick={() => handlePersonClick("Jesus")}
                  />
                )}
                {manhattanPeople.includes("Skyelar") && (
                  <img
                    className={`challenge-4__face challenge-4__face--right ${
                      selectedPerson === "Skyelar" ? "challenge-4__face--selected" : ""
                    }`}
                    src="/c4_faces/skyelar.png"
                    alt="Skyelar"
                    onClick={() => handlePersonClick("Skyelar")}
                  />
                )}
              </>
            )}
            {isAtRoosevelt && rooseveltPeople.length > 0 && (
              <>
                {rooseveltPeople.map((person, index) => (
                  <img
                    key={person}
                    className={`challenge-4__face ${
                      index === 0
                        ? "challenge-4__face--top"
                        : index === 1
                          ? "challenge-4__face--left"
                          : "challenge-4__face--right"
                    } ${
                      selectedPerson === person ? "challenge-4__face--selected" : ""
                    }`}
                    src={`/c4_faces/${person.toLowerCase()}.png`}
                    alt={person}
                    onClick={() => handlePersonClick(person)}
                  />
                ))}
                <button
                  className={`challenge-4__nobody ${
                    selectedPerson === "Nobody" ? "challenge-4__nobody--selected" : ""
                  }`}
                  type="button"
                  onClick={() => handlePersonClick("Nobody")}
                >
                  Nobody
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showTram && (
        <img
          className={`challenge-4__tram ${
            tramDirection === "toManhattan" ? "challenge-4__tram--reverse" : ""
          }`}
          src="/c4_faces/tram.png"
          alt="Tram"
        />
      )}
      {hasLost && !showTram && (
        <div className="challenge-4__overlay">
          <div className="challenge-4__loss fade-in">
            <p>{lossReason ?? "You lost. Try again from the beginning."}</p>
            <button className="challenge-4__loss-button" type="button" onClick={resetGame}>
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
