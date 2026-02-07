"use client";

import { useEffect, useState } from "react";

type EvilTypeTextProps = {
  text: string;
  speedMs?: number;
};

export default function EvilTypeText({ text, speedMs = 70 }: EvilTypeTextProps) {
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
    <div className="evil-type-text">
      <h1 className="type-text__content">
        {text.slice(0, visibleCount)}
      </h1>
    </div>
  );
}
