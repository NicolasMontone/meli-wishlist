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
    [
      "🎁",
      "🎁",
      "🎁",
      "🎁",
      "🎁",
      "🎁",
      "🎄",
      "🛍️",
      "🛍️",
      "⭐",
      "🎀",
      "🎀",
      "✨",
      "✨",
      "🎉",
      "🎈",
      "🍰",
      "🍾",
      "🥂",
      "🌟",
      "🌈",
      "☀️",
      "🌙",
      "⭐",
      "✨",
      "✨",
    ],
  ];

  const backgroundColors = [
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    // "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    // "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    // "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    // "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    // "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    // "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    // "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
    // "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    // "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
  useEffect(() => {
    const bottomLayerCount = 50;
    const topLayerCount = 40;
    const positions = Array(bottomLayerCount + topLayerCount)
      .fill(null)
      .map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        fontSize: Math.random() * 4 + 2,
        floatDelay: Math.random() * -20,
        floatDuration: Math.random() * 4 + 3,
        floatDistance: Math.random() * 15 + 5,
        emoji:
          selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)],
      }));
    setEmojiPositions(positions);
  }, [selectedEmojis.length]);

  const getEmojiStyle = (index: number, isTopLayer: boolean) => {
    if (!emojiPositions[index]) return {};

    const position = emojiPositions[index];
    return {
      fontSize: `clamp(2rem, ${position.fontSize}vw, ${
        position.fontSize + 2
      }rem)`,
      transform: "none",
      position: "absolute",
      top: `${position.top}%`,
      left: `${position.left}%`,
      animationName: partyMode
        ? "partyMode"
        : clickedEmojis.has(index)
        ? "popEmoji"
        : "float",
      animationDuration: partyMode
        ? "0.5s"
        : clickedEmojis.has(index)
        ? "1s"
        : `${position.floatDuration}s`,
      animationTimingFunction: "ease-in-out",
      animationIterationCount: partyMode
        ? "infinite"
        : clickedEmojis.has(index)
        ? "1"
        : "infinite",
      animationDelay: `${position.floatDelay}s`,
      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
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
                    style={getEmojiStyle(index, false)}
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
                  <span
                    key={`top-${index}`}
                    className="emoji select-none cursor-pointer"
                    onClick={() => handleEmojiClick(index)}
                    style={getEmojiStyle(index, true)}
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
            @keyframes float {
              0% {
                transform: translate(0, 0) rotate(0deg);
              }
              25% {
                transform: translate(3px, -8px) rotate(2deg);
              }
              50% {
                transform: translate(-3px, -15px) rotate(-1deg);
              }
              75% {
                transform: translate(3px, -8px) rotate(2deg);
              }
              100% {
                transform: translate(0, 0) rotate(0deg);
              }
            }

            .emoji {
              cursor: pointer;
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              will-change: transform, filter;
            }

            .emoji:hover {
              animation: hover-bounce 1.5s ease-in-out infinite !important;
              filter: brightness(1.5)
                drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
              transform: scale(1.2) translateY(-10px);
              z-index: 1000;
            }

            @keyframes hover-bounce {
              0% {
                transform: scale(1.2) translateY(-10px) rotate(0deg);
                filter: brightness(1.5)
                  drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
              }
              25% {
                transform: scale(1.25) translateY(-15px) rotate(3deg);
                filter: brightness(1.6)
                  drop-shadow(0 0 20px rgba(255, 255, 255, 0.9));
              }
              50% {
                transform: scale(1.2) translateY(-10px) rotate(0deg);
                filter: brightness(1.5)
                  drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
              }
              75% {
                transform: scale(1.25) translateY(-15px) rotate(-3deg);
                filter: brightness(1.6)
                  drop-shadow(0 0 20px rgba(255, 255, 255, 0.9));
              }
              100% {
                transform: scale(1.2) translateY(-10px) rotate(0deg);
                filter: brightness(1.5)
                  drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
              }
            }

            .emoji.floating {
              animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes popEmoji {
              0% {
                transform: scale(1) rotate(0deg) translateY(0);
              }
              25% {
                transform: scale(1.8) rotate(180deg) translateY(-30px);
              }
              50% {
                transform: scale(2.2) rotate(360deg) translateY(-50px);
              }
              75% {
                transform: scale(1.5) rotate(540deg) translateY(-20px);
              }
              100% {
                transform: scale(1) rotate(720deg) translateY(0);
              }
            }

            @keyframes partyMode {
              0% {
                transform: scale(1) rotate(0deg) translateY(0);
                filter: hue-rotate(0deg) brightness(1);
              }
              25% {
                transform: scale(1.5) rotate(90deg) translateY(-20px);
                filter: hue-rotate(90deg) brightness(1.5);
              }
              50% {
                transform: scale(2) rotate(180deg) translateY(-40px);
                filter: hue-rotate(180deg) brightness(2);
              }
              75% {
                transform: scale(1.5) rotate(270deg) translateY(-20px);
                filter: hue-rotate(270deg) brightness(1.5);
              }
              100% {
                transform: scale(1) rotate(360deg) translateY(0);
                filter: hue-rotate(360deg) brightness(1);
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
