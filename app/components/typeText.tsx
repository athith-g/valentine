"use client";

import { useEffect, useState } from "react";

type TypeTextProps = {
  text: string;
  speedMs?: number;
};

export default function TypeText({ text, speedMs = 70 }: TypeTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const intervalId = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          window.clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => window.clearInterval(intervalId);
  }, [text, speedMs]);

  return (
    <div className="type-text">
      <h1 className="type-text__content">
        {text.slice(0, visibleCount)}
        <span className="type-text__cursor" aria-hidden="true">
          |
        </span>
      </h1>
    </div>
  );
}