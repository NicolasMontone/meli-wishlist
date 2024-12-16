"use client";

import { UsernameForm } from "@/components/username-form";
import { CreateWishlist } from "@/components/create-wishlist";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiBackground } from "@/components/emoji-background";

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

  const selectedBackground =
    "linear-gradient(135deg, #A9C9FF 0%, #FFBBEC 100%)";

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
            <EmojiBackground />

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
