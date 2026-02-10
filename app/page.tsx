"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CHECKBOX_LABELS = [
  "You're on a laptop.",
  "You turned your volume up (this is an audiovisual experience).",
  "You're not a robot."
];

const message = [
  "Hi Babe,",
  "I've spent a decent amount of time creating this little project.",
  "There's a special message at the end of this.",
  "I keep trying to make this work, but someone keeps trying to sabatoge me.",
  "I think he's small and green but I've never been able to get a good look at him.",
  "When you click the button below, I'm hoping you'll see what I made for you.",
];

const CONFIRM_FADE_MS = 700;
const MESSAGE_FADE_MS = 700;

export default function Home() {
  const confirmTimeoutRef = useRef<number | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);
  const [checked, setChecked] = useState(() =>
    CHECKBOX_LABELS.map(() => false)
  );
  const [showConfirm, setShowConfirm] = useState(true);
  const [isConfirmFading, setIsConfirmFading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isMessageFading, setIsMessageFading] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const router = useRouter();

  const allChecked = useMemo(() => checked.every(Boolean), [checked]);

  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) {
        window.clearTimeout(confirmTimeoutRef.current);
      }
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleConfirmClick = () => {
    if (!allChecked || isConfirmFading) {
      return;
    }

    setIsConfirmFading(true);
    confirmTimeoutRef.current = window.setTimeout(() => {
      setShowConfirm(false);
      setShowMessage(true);
    }, CONFIRM_FADE_MS);
  };

  const handleMessageClick = () => {
    if (isMessageFading) {
      return;
    }

    setIsMessageFading(true);
    setIsDarkBackground(true);
    messageTimeoutRef.current = window.setTimeout(() => {
      router.push("/uh-oh");
    }, MESSAGE_FADE_MS);
  };

  return (
    <div
      className={`confirm-page ${isDarkBackground ? "confirm-page--dark" : ""}`}
    >
      {showConfirm && (
        <div className={`confirm-card ${isConfirmFading ? "confirm-fade-out" : ""}`}>
          <h1 className="confirm-title">Confirm:</h1>
          <div className="confirm-options">
            {CHECKBOX_LABELS.map((label, index) => (
              <label key={label} className="confirm-option">
                <input
                  className="confirm-checkbox"
                  type="checkbox"
                  checked={checked[index]}
                  onChange={(event) => {
                    const next = [...checked];
                    next[index] = event.target.checked;
                    setChecked(next);
                  }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <button
            className="confirm-button"
            type="button"
            disabled={!allChecked}
            onClick={handleConfirmClick}
          >
            Continue
          </button>
        </div>
      )}
      {showMessage && (
        <div
          className={`message-card ${
            isMessageFading ? "message-fade-out" : "message-fade-in"
          }`}
        >
          <div className="message-text">
            {message.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <button className="confirm-button" type="button" onClick={handleMessageClick}>
            View message
          </button>
        </div>
      )}
    </div>
  );
}