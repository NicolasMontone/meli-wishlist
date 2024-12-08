'use client'

import { UsernameForm } from '@/components/username-form'
import { CreateWishlist } from '@/components/create-wishlist'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { isMobile } from '@/lib/isMobile'
import { useToast } from '../hooks/use-toast'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <WishlistFlow />
    </div>
  )
}

function WishlistFlow() {
  const { toast } = useToast()
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

  const handleShare = async () => {
    if (isMobile()) {
      if (navigator.share) {
        await navigator.share({
          title: 'Lista de Deseos',
          text: 'Lista de deseos compartida con vos',
          url: `${window.location.origin}/${session?.username}`,
        })
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/${session?.username}`
        )
        toast({
          title: 'URL copiada',
          description: 'La URL de tu lista ha sido copiada al portapapeles',
        })
      }
    } else {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${session?.username}`
      )
      toast({
        title: 'URL copiada',
        description: 'La URL de tu lista ha sido copiada al portapapeles',
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      <nav className="border-b bg-primary mb-8">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary-foreground">
            {session?.username ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {`${session.username} - Lista de Deseos`}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Lista de Deseos
              </motion.div>
            )}
          </h1>

          {session && (
            <Button variant="outline" onClick={handleShare}>
              Compartir
            </Button>
          )}
        </div>
      </nav>
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
          <main className="container mx-auto p-4 space-y-8">
            <CreateWishlist
              sessionId={session.sessionId}
              username={session.username}
            />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
