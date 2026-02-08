"use client";

import { useState } from "react";
import ChallengeDirections from "../components/challengeDirections";
import Challenge1Game from "../challenges/challenge1";

export default function Challenge1() {
  const [challengeStarted, setChallengeStarted] = useState(false);
  const CHALLENGE_DIRECTIONS = {
    text: [
      "For this challenge, you will need to enter the correct date in order to unlock the next challenge.",
      "What's the date you ask?",
      "I'm evil. I don't give hints. Bad luck!",
    ],
    buttonText: "Start Challenge",
    onButtonClick: () => {
      setChallengeStarted(true);
    },
  }

  return (
    <div className="main-app bg-dark">
      {challengeStarted ? (
        <div className="fade-in">
          <Challenge1Game />
        </div>
      ) : (
        <ChallengeDirections text={CHALLENGE_DIRECTIONS.text} buttonText={CHALLENGE_DIRECTIONS.buttonText} onButtonClick={CHALLENGE_DIRECTIONS.onButtonClick} />
      )}
    </div>
  );
}
