"use client";

import { UsernameForm } from "@/components/username-form";
import { CreateWishlist } from "@/components/create-wishlist";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <WishlistFlow />
    </div>
  );
}

function WishlistFlow() {
  const [session, setSession] = useState<{
    username: string;
    sessionId: string;
  } | null>(null);

  const emojiSets = [
    // Gift and celebration theme
    [
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
      "🌸",
      "🪄",
      "🔮",
      "💫",
    ],
  ];

  const backgroundColors = [
    // "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #A9C9FF 0%, #FFBBEC 100%)",
    // "linear-gradient(135deg, #FFF886 0%, #F072B6 100%)",
    // "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)",
    // "linear-gradient(135deg, #FBDA61 0%, #FF5ACD 100%)",
  ];

  const selectedEmojis =
    emojiSets[Math.floor(Math.random() * emojiSets.length)];
  const selectedBackground =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  useEffect(() => {
    const savedSession = localStorage.getItem("wishlist_session");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const handleComplete = (username: string, sessionId: string) => {
    const newSession = { username, sessionId };
    setSession(newSession);
    localStorage.setItem("wishlist_session", JSON.stringify(newSession));
  };

  // Add state for tracking clicked emojis
  const [clickedEmojis, setClickedEmojis] = useState<Set<number>>(new Set());

  // Add easter egg states
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [partyMode, setPartyMode] = useState(false);

  const handleEmojiClick = (index: number) => {
    const currentTime = Date.now();

    // Add this emoji to clicked set
    setClickedEmojis((prev) => new Set(prev).add(index));

    // Reset clicked emoji after animation
    setTimeout(() => {
      setClickedEmojis((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 1000);

    // Handle rapid clicks for easter egg
    if (currentTime - lastClickTime > 500) {
      // Reset if more than 500ms between clicks
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }
    setLastClickTime(currentTime);

    // Trigger party mode after 5 quick clicks
    if (clickCount >= 4) {
      setPartyMode(true);
      setClickCount(0);
      setTimeout(() => setPartyMode(false), 3000); // Party for 3 seconds
    }
  };

  // Add state for emoji positions
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

  // Initialize positions once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const bottomLayerCount = 50;
    const topLayerCount = 40;
    const positions = [];
    const usedEmojisMap = new Map(); // Track recently used emojis and their positions

    for (let i = 0; i < bottomLayerCount + topLayerCount; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      // Find an emoji that's not recently used nearby
      let selectedEmoji: string | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const candidateEmoji =
          selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];
        let tooClose = false;

        // Check if this emoji is too close to same emoji
        for (const [emoji, pos] of usedEmojisMap.entries()) {
          if (emoji === candidateEmoji) {
            const distance = Math.sqrt(
              (top - pos.top) ** 2 + (left - pos.left) ** 2
            );
            if (distance < 20) {
              // Minimum distance threshold
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

      // If we couldn't find a unique emoji after max attempts, just use a random one
      if (!selectedEmoji) {
        selectedEmoji =
          selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];
      }

      // Update the used emojis map
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
  }, [selectedEmojis.length]);

  const getEmojiStyle = (index: number, isTopLayer: boolean) => {
    if (!emojiPositions[index]) return {};

    const position = emojiPositions[index];
    return {
      fontSize: `clamp(2rem, ${position.fontSize}vw, ${
        position.fontSize + 2
      }rem)`,
      position: "absolute",
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
    <AnimatePresence mode="wait">
      {!session ? (
        <motion.div
          key="username-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
            style={{
              background: selectedBackground,
            }}
          >
            {/* Bottom layer of emojis */}
            <div className="absolute h-screen inset-0 flex flex-wrap">
              {Array.from({ length: 50 }).map((_, index) => {
                const gridCols = 8;
                const gridRows = 7;
                const col = index % gridCols;
                const row = Math.floor(index / gridCols);
                const left = col * (100 / gridCols) + (Math.random() * 8 - 4);
                const top = row * (100 / gridRows) + (Math.random() * 8 - 4);
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <span
                    key={`bottom-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                    className="emoji select-none cursor-pointer"
                    onClick={() => handleEmojiClick(index)}
                    style={getEmojiStyle(index, false) as React.CSSProperties}
                  >
                    {emojiPositions[index]?.emoji}
                  </span>
                );
              })}
            </div>

            {/* Blur layer */}
            <div className="absolute h-screen inset-0 backdrop-blur-2xl" />

            {/* Top layer of emojis */}
            <div className="absolute h-screen inset-0 flex flex-wrap">
              {Array.from({ length: 40 }).map((_, index) => {
                const gridCols = 6;
                const gridRows = 5;
                const col = index % gridCols;
                const row = Math.floor(index / gridCols);

                // Calculate base position
                let left = col * (100 / gridCols);
                let top = row * (100 / gridRows);

                // Add more variance to positions based on distance from center
                const distanceFromCenterX = Math.abs(left - 50) / 50; // 0 at center, 1 at edges
                const distanceFromCenterY = Math.abs(top - 50) / 50;

                // Add more randomness to positions based on distance from center
                const edgeRandomness =
                  Math.max(distanceFromCenterX, distanceFromCenterY) * 20;
                left += Math.random() * edgeRandomness - edgeRandomness / 2;
                top += Math.random() * edgeRandomness - edgeRandomness / 2;

                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <span
                    key={`top-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                    className="emoji select-none cursor-pointer"
                    onClick={() => handleEmojiClick(index)}
                    style={getEmojiStyle(index, true) as React.CSSProperties}
                  >
                    {emojiPositions[index]?.emoji}
                  </span>
                );
              })}
            </div>

            <div className="z-10 relative">
              <UsernameForm onComplete={handleComplete} />
            </div>
          </div>
          <style jsx global>{`
            @keyframes sparkle {
              0%,
              100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.5;
                transform: scale(0.8);
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-15px);
              }
            }

            .background-sparkle {
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 10%
              );
              animation: sparkle 3s ease-in-out infinite;
              pointer-events: none;
            }

            .emoji {
              cursor: pointer;
              transition: all 0.3s ease;
              will-change: transform;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
                0 4px 16px rgba(0, 0, 0, 0.1);
            }

            .emoji:hover {
              filter: brightness(1.5);
              transform: scale(1.2) translateY(-5px);
              z-index: 1000;
              text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                0 8px 24px rgba(0, 0, 0, 0.15);
            }

            @keyframes partyMode {
              0% {
                transform: translate(0, 0) rotate(0deg);
              }
              25% {
                transform: translate(100px, -100px) rotate(90deg);
              }
              50% {
                transform: translate(-100px, -50px) rotate(180deg);
              }
              75% {
                transform: translate(50px, 100px) rotate(270deg);
              }
              100% {
                transform: translate(0, 0) rotate(360deg);
              }
            }
          `}</style>
        </motion.div>
      ) : (
        <motion.div
          key="create-wishlist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <main className="container mx-auto p-4 space-y-8">
            <CreateWishlist
              sessionId={session.sessionId}
              username={session.username}
            />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
