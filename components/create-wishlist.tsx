'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { useToast } from '@/hooks/use-toast'
import { Input } from './ui/input'
import { Button } from './ui/button'

import { WishlistItem } from './wishlist-item'
import { useWishlist } from '@/hooks/use-wishlist'
import { Label } from './ui/label'

interface CreateWishlistProps {
  sessionId: string
  username: string
}

export function CreateWishlist({ sessionId }: CreateWishlistProps) {
  const { wishlist, isLoading, addUrl, deleteUrl } = useWishlist(sessionId)
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const { toast } = useToast()

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    await addUrl(newUrl)
    setNewUrl('')
    setIsAdding(false)
    toast({
      title: 'Artículo añadido',
      description: 'El artículo ha sido añadido a tu lista de deseos.',
    })
  }

  const isFirstLoading = isLoading && wishlist.length === 0 && !isAdding
  const isEmpty = wishlist.length === 0 && !isFirstLoading

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleAddUrl}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="url" className="text-md text-muted-foreground">
            URL del artículo
          </Label>
          <div className="flex gap-2">
            <Input
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://articulo.mercadolibre....."
            />
            <Button type="submit" disabled={isLoading || isAdding}>
              {isLoading ? 'Cargando...' : 'Añadir'}
            </Button>
          </div>
        </div>
      </form>

      {wishlist.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {wishlist.map((item) => (
            <WishlistItem key={item.url} item={item} />
          ))}
        </div>
      )}
      {isEmpty && (
        <p className="text-muted-foreground mt-4">
          No hay artículos en tu lista de deseos
        </p>
      )}
      {isFirstLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Falsooo
          <div key={index} className="h-24 w-full bg-gray-100 animate-pulse" />
        ))}
    </motion.div>
  )
}
