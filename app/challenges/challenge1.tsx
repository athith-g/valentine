import EvilTypeText from "../components/evilTypeText";
import { useEffect, useState } from "react";
import EvilSmiskiDialog from "../components/evilSmiskiDialog";
import ChallengeDirections from "../components/challengeDirections";

export default function Challenge1Game() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const isMonthValid = month === "7" || month === "07";
  const isDayValid = day === "5" || day === "05";
  const isYearValid = year === "2025";

  const monthClass = month.length
    ? isMonthValid
      ? "challenge-1__input--valid"
      : "challenge-1__input--invalid"
    : "";
  const dayClass = day.length
    ? isDayValid
      ? "challenge-1__input--valid"
      : "challenge-1__input--invalid"
    : "";
  const yearClass = year.length
    ? isYearValid
      ? "challenge-1__input--valid"
      : "challenge-1__input--invalid"
    : "";

  const allValid = isMonthValid && isDayValid && isYearValid;

  useEffect(() => {
    if (!allValid || isFadingOut) {
      return;
    }

    setIsFadingOut(true);
    window.setTimeout(() => {
      setShowDialog(true);
    }, 600);
  }, [allValid, isFadingOut]);

  return (
    <div className="challenge-wrapper">
      <div className={`challenge-1 ${isFadingOut ? "challenge-1--fade" : ""}`}>
        <div className="challenge__directions">
          <p>
            Enter the correct date to unlock the next challenge. All inputs should be green.
          </p>
        </div>
        <div className="challenge-1__game">
          <img src="/lock.png" alt="Lock" className="challenge-1__lock" />
          <div className="challenge-1__inputs">
            <input
              type="text"
              className={`challenge-1__input1 ${monthClass}`}
              placeholder="MM"
              inputMode="numeric"
              maxLength={2}
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
            <input
              type="text"
              className={`challenge-1__input2 ${dayClass}`}
              placeholder="DD"
              inputMode="numeric"
              maxLength={2}
              value={day}
              onChange={(event) => setDay(event.target.value)}
            />
            <input
              type="text"
              className={`challenge-1__input3 ${yearClass}`}
              placeholder="YYYY"
              inputMode="numeric"
              maxLength={4}
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </div>
        </div>
      </div>
      <EvilSmiskiDialog
        phrases={[
          "You think you're so smart, huh?",
          "THAT WAS MY EASY CHALLENGE!",
          "YOU WERE SUPPOSED TO GET IT MUCH QUICKER!",
          "Anyway,",
          "I'm not stressed at all...",
          "You know how your idiot man always complains about your memory?",
          "Let's see if he's right...",
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
              "Challenge 2 awaits.",
              "The rules will be revealed soon.",
              "Get ready for the next test.",
            ]}
            buttonText="Next challenge"
            onButtonClick={() => {
              window.location.href = "/challenge_2";
            }}
          />
        </div>
      )}
    </div>
  );
}