'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { ArrowRightIcon, Loader } from 'lucide-react'

interface UsernameFormProps {
  onComplete: (username: string, sessionId: string) => void
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function UsernameForm({ onComplete }: UsernameFormProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un nombre de usuario',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim().toLowerCase() }),
      });

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la lista')
      }

      onComplete(data.username, data.sessionId)

      toast({
        title: '¡Bienvenido! 👋',
        description: 'Ahora puedes crear tu lista de deseos',
      })
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Algo salió mal',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Card className="max-w-[700px] p-8 shadow-2xl">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl">Armemos tu lista!</CardTitle>
            <CardDescription className="text-lg">
              Ingresa tu nombre y crea tu lista de deseos
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="gap-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-1 border rounded pl-2 bg-gray-100">
                <span className="text-muted-foreground text-md">
                  {typeof window !== 'undefined'
                    ? window.location.origin.replace('https://', '')
                    : ''}
                  /
                </span>
                <Input
                  value={username}
                  className="border-none p-0 text-md pl-2 text-black bg-white"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full group text-lg p-6"
                disabled={isLoading || username.length < 1}
              >
                {isLoading ? 'Creando...' : 'Continuar'}
                {isLoading ? (
                  <Loader className="ml-auto animate-spin w-6 h-6 " />
                ) : (
                  <ArrowRightIcon className="ml-auto w-6 h-6 group-hover:translate-x-2 transition-all duration-100" />
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
