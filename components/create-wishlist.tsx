'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { useToast } from '../hooks/use-toast'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

import { WishlistItem } from './wishlist-item'
import { isMeliUrl } from '@/utils/isMeliUrl'
import { useWishlist } from '@/hooks/use-wishlist'
import { ShareWishlist } from './share-wishlist'

interface CreateWishlistProps {
  sessionId: string
  username: string
}

export function CreateWishlist({ sessionId }: CreateWishlistProps) {
  const { wishlist, isLoading, addUrl, deleteUrl } = useWishlist(sessionId)

  const [newUrl, setNewUrl] = useState('')
  const { toast } = useToast()

  const saveWishlist = async (newWishlist: typeof wishlist) => {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          urls: newWishlist.map((item) => item.url),
        }),
      })
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addUrl(newUrl)
    setNewUrl('')
    toast({
      title: 'Artículo añadido',
      description: 'El artículo ha sido añadido a tu lista de deseos.',
    })
  }

  const removeUrl = async (url: string) => {
    await deleteUrl(url)

    toast({
      title: 'Artículo eliminado',
      description: 'El artículo ha sido eliminado de tu lista de deseos.',
    })
  }

  if (isLoading && wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Cargando lista de deseos...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Añadir Artículo</CardTitle>
        </CardHeader>
        <form onSubmit={handleAddUrl}>
          <CardContent>
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://articulo.mercadolibre....."
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Añadir'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {wishlist.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {wishlist.map((item) => (
            <WishlistItem key={item.url} item={item} />
          ))}
        </div>
      )}
      <ShareWishlist />
    </motion.div>
  )
}
