"use client";

import { UsernameForm } from "@/components/username-form";
import { CreateWishlist } from "@/components/create-wishlist";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../hooks/use-toast";

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
  const [clickCount, setClickCount] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

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
    if (currentTime - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }

    setLastClickTime(currentTime);

    if (clickCount >= 4) {
      setEasterEggActive(true);
      setClickCount(0);
      setTimeout(() => setEasterEggActive(false), 3000);
    }
  };

  const getEmojiStyle = (index: number, isTopLayer: boolean) => ({
    fontSize: `clamp(2rem, ${Math.random() * 4 + 2}vw, ${
      Math.random() * 8 + 4
    }rem)`,
    transform: "none",
    position: "absolute",
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animation: `${
      easterEggActive
        ? "partyMode 1s ease-in-out infinite"
        : clickedEmojis.has(index)
        ? "popEmoji 1s ease-in-out"
        : `float ${
            Math.random() * (isTopLayer ? 4 : 3) + (isTopLayer ? 3 : 2)
          }s ease-in-out infinite`
    }`,
    transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    userSelect: "none",
  });

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
                  <span
                    key={`bottom-${index}`}
                    className="emoji select-none cursor-pointer"
                    onClick={() => handleEmojiClick(index)}
                    style={getEmojiStyle(index, false)}
                  >
                    {
                      selectedEmojis[
                        Math.floor(Math.random() * selectedEmojis.length)
                      ]
                    }
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
                    {
                      selectedEmojis[
                        Math.floor(Math.random() * selectedEmojis.length)
                      ]
                    }
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
                transform: translateY(0px) rotate(0deg);
              }
              25% {
                transform: translateY(-15px) rotate(-5deg);
              }
              75% {
                transform: translateY(15px) rotate(5deg);
              }
              100% {
                transform: translateY(0px) rotate(0deg);
              }
            }

            @keyframes crazyWobble {
              0% {
                transform: rotate(0deg) scale(1);
                filter: hue-rotate(0deg) brightness(1);
              }
              10% {
                transform: rotate(-25deg) scale(1.8) translateY(-20px);
                filter: hue-rotate(36deg) brightness(1.3);
              }
              20% {
                transform: rotate(25deg) scale(2.2) translateX(20px);
                filter: hue-rotate(72deg) brightness(1.4);
              }
              30% {
                transform: rotate(-35deg) scale(2.4) translateY(20px);
                filter: hue-rotate(108deg) brightness(1.5);
              }
              40% {
                transform: rotate(35deg) scale(2.6) translateX(-20px);
                filter: hue-rotate(144deg) brightness(1.6);
              }
              50% {
                transform: rotate(-45deg) scale(2.8) translateY(-25px);
                filter: hue-rotate(180deg) brightness(1.7);
              }
              60% {
                transform: rotate(45deg) scale(2.6) translateX(25px);
                filter: hue-rotate(216deg) brightness(1.6);
              }
              70% {
                transform: rotate(-35deg) scale(2.4) translateY(25px);
                filter: hue-rotate(252deg) brightness(1.5);
              }
              80% {
                transform: rotate(25deg) scale(2.2) translateX(-25px);
                filter: hue-rotate(288deg) brightness(1.4);
              }
              90% {
                transform: rotate(-25deg) scale(1.8) translateY(-20px);
                filter: hue-rotate(324deg) brightness(1.3);
              }
              100% {
                transform: rotate(0deg) scale(1);
                filter: hue-rotate(360deg) brightness(1);
              }
            }

            .emoji {
              transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              transform-origin: center center;
            }

            .emoji:hover {
              z-index: 1000;
              filter: brightness(1.4);
              text-shadow: 0 0 30px rgba(255, 255, 255, 0.9);
              animation: crazyWobble 1s ease-in-out;
            }

            @keyframes popEmoji {
              0% {
                transform: scale(1) rotate(0deg);
              }
              20% {
                transform: scale(1.5) rotate(-15deg);
              }
              40% {
                transform: scale(2) rotate(15deg) translateY(-20px);
              }
              60% {
                transform: scale(2.2) rotate(-15deg) translateY(-30px);
              }
              80% {
                transform: scale(1.5) rotate(15deg) translateY(-10px);
              }
              100% {
                transform: scale(1) rotate(0deg) translateY(0);
              }
            }

            @keyframes partyMode {
              0% {
                transform: scale(1) rotate(0deg);
                filter: hue-rotate(0deg);
              }
              25% {
                transform: scale(1.8) rotate(90deg);
                filter: hue-rotate(90deg) brightness(1.5);
              }
              50% {
                transform: scale(2.2) rotate(180deg);
                filter: hue-rotate(180deg) brightness(2);
              }
              75% {
                transform: scale(1.8) rotate(270deg);
                filter: hue-rotate(270deg) brightness(1.5);
              }
              100% {
                transform: scale(1) rotate(360deg);
                filter: hue-rotate(360deg);
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
