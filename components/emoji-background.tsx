"use client";

import { useEffect, useState } from "react";

const EMOJI_SET = [
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎁",
  "🎀",
  "🎈",
  "🎈",
  "🎈",
  "🎈",
  "🎈",
  "🎉",
  "✨",
  "⭐",
  "🎮",
  "🎨",
  "🍰",
  "🧁",
  "🍪",
  "🍭",
  "🍫",
  "🍿",
  "🥤",
  "🍾",
  "🥂",
  "🎂",
  "🍦",
  "",
  "🌺",
  "🪄",
  "🔮",
  "💫",
  "🛍️",
  "🛍️",
  "🛍️",
  "🛍️",
  "🛍️",
];

export function EmojiBackground() {
  const [partyMode, setPartyMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [emojiPositions, setEmojiPositions] = useState<
    Array<{
      top: number;
      left: number;
      fontSize: number;
      floatDelay: number;
      floatDuration: number;
      floatDistance: number;
      emoji: string;
    }>
  >([]);

  const handleEmojiClick = (index: number) => {
    const currentTime = Date.now();

    if (currentTime - lastClickTime > 500) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }
    setLastClickTime(currentTime);

    if (clickCount >= 4) {
      setPartyMode(true);
      setClickCount(0);
      setTimeout(() => setPartyMode(false), 3000);
    }
  };

  useEffect(() => {
    const bottomLayerCount = 50;
    const topLayerCount = 40;
    const positions = [];
    const usedEmojisMap = new Map();

    for (let i = 0; i < bottomLayerCount + topLayerCount; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      let selectedEmoji: string | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const candidateEmoji =
          EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
        let tooClose = false;

        for (const [emoji, pos] of usedEmojisMap.entries()) {
          if (emoji === candidateEmoji) {
            const distance = Math.sqrt(
              (top - pos.top) ** 2 + (left - pos.left) ** 2
            );
            if (distance < 20) {
              tooClose = true;
              break;
            }
          }
        }

        if (!tooClose) {
          selectedEmoji = candidateEmoji;
          break;
        }
        attempts++;
      }

      if (!selectedEmoji) {
        selectedEmoji = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
      }

      usedEmojisMap.set(selectedEmoji, { top, left });

      positions.push({
        top,
        left,
        fontSize: Math.random() * 4 + 2,
        floatDelay: Math.random() * -20,
        floatDuration: Math.random() * 4 + 3,
        floatDistance: Math.random() * 15 + 5,
        emoji: selectedEmoji,
      });
    }
    setEmojiPositions(positions);
  }, []);

  const getEmojiStyle = (index: number) => {
    if (!emojiPositions[index]) return {};

    const position = emojiPositions[index];
    return {
      fontSize: `clamp(2rem, ${position.fontSize}vw, ${
        position.fontSize + 2
      }rem)`,
      position: "fixed",
      top: `${position.top}%`,
      left: `${position.left}%`,
      animationName: partyMode ? "partyMode" : "float",
      animationDuration: partyMode ? "3s" : `${position.floatDuration}s`,
      animationTimingFunction: "ease-in-out",
      animationIterationCount: partyMode ? "infinite" : "infinite",
      animationDelay: `${position.floatDelay}s`,
      transform: "none",
      userSelect: "none",
    };
  };

  return (
    <div className=" z-1">
      <div className="fixed h-screen w-full inset-0 flex flex-wrap">
        {Array.from({ length: 50 }).map((_, index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <span
            key={`bottom-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="emoji select-none cursor-pointer"
            onClick={() => handleEmojiClick(index)}
            style={getEmojiStyle(index) as React.CSSProperties}
          >
            {emojiPositions[index]?.emoji}
          </span>
        ))}
      </div>

      <div className="absolute h-screen inset-0 backdrop-blur-2xl" />

      <div className="absolute h-screen inset-0 flex flex-wrap">
        {Array.from({ length: 20 }).map((_, index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <span
            key={`top-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="emoji select-none cursor-pointer z-2"
            onClick={() => handleEmojiClick(index)}
            style={getEmojiStyle(index) as React.CSSProperties}
          >
            {emojiPositions[index]?.emoji}
          </span>
        ))}
      </div>
      <div className="absolute h-screen inset-0 backdrop-blur-md" />
      <div className="absolute h-screen inset-0 flex flex-wrap">
        {Array.from({ length: 20 }).map((_, index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <span
            key={`top-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="emoji select-none cursor-pointer z-2"
            onClick={() => handleEmojiClick(index + 20)}
            style={getEmojiStyle(index + 20) as React.CSSProperties}
          >
            {emojiPositions[index + 20]?.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
