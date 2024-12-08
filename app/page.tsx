'use client'

import { UsernameForm } from '@/components/username-form'
import { CreateWishlist } from '@/components/create-wishlist'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-primary">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary-foreground">
            Mi Lista de Deseos
          </h1>
        </div>
      </nav>
      <main className="container mx-auto p-4 space-y-8">
        <WishlistFlow />
      </main>
    </div>
  )
}

function WishlistFlow() {
  const [session, setSession] = useState<{
    username: string
    sessionId: string
  } | null>(null)

  useEffect(() => {
    const savedSession = localStorage.getItem('wishlist_session')
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
  }, [])

  const handleComplete = (username: string, sessionId: string) => {
    const newSession = { username, sessionId }
    setSession(newSession)
    localStorage.setItem('wishlist_session', JSON.stringify(newSession))
  }

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
          <UsernameForm onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="create-wishlist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CreateWishlist
            sessionId={session.sessionId}
            username={session.username}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
