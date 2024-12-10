'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { useToast } from '@/hooks/use-toast'
import { Input } from './ui/input'
import { Button } from './ui/button'

import { useWishlist } from '@/hooks/use-wishlist'
import { Label } from './ui/label'
import { Loader, PlusIcon } from 'lucide-react'
import { isMobile } from '@/lib/isMobile'
import BentoGrid from './bento'
import { isMeliUrl } from '../utils/isMeliUrl'

interface CreateWishlistProps {
  sessionId: string
  username: string
}

export function CreateWishlist({ sessionId, username }: CreateWishlistProps) {
  const { wishlist, isLoading, addUrl, deleteUrl } = useWishlist(sessionId)
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const { toast } = useToast()

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    if (!isMeliUrl(newUrl)) {
      toast({
        title: 'URL inválida',
        description: 'La URL no es válida',
      })
      return
    }
    await addUrl(newUrl)
    setNewUrl('')
    setIsAdding(false)
    toast({
      title: 'Artículo añadido',
      description: 'El artículo ha sido añadido a tu lista de deseos.',
    })
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    const encodedUsername = `${window.location.origin}/${encodeURIComponent(
      username || ''
    )}`
    if (isMobile()) {
      if (navigator.share) {
        await navigator.share({
          title: 'Lista de Deseos',
          text: 'Lista de deseos compartida con vos',
          url: encodedUsername,
        })
      } else {
        await navigator.clipboard.writeText(encodedUsername)
        toast({
          title: 'URL copiada',
          description: 'La URL de tu lista ha sido copiada al portapapeles',
        })
      }
    } else {
      await navigator.clipboard.writeText(encodedUsername)
      toast({
        title: 'URL copiada',
        description: 'La URL de tu lista ha sido copiada al portapapeles',
      })
    }
  }

  const isFirstLoading = isLoading && wishlist.length === 0 && !isAdding
  const isEmpty = wishlist?.length === 0 && !isFirstLoading

  const [firstItem, ...restItems] = wishlist

  const items = firstItem
    ? [
        { ...firstItem, onDelete: (url: string) => deleteUrl(url) },
        { share: handleShare },
        ...restItems.map((item) => ({
          ...item,
          onDelete: (url: string) => deleteUrl(url),
        })),
      ]
    : []

  console.log(items)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleAddUrl} className="mt-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="url" className="text-md text-muted-foreground">
            Pega la URL del artículo
          </Label>
          <div className="flex gap-2">
            <Input
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://articulo.mercadolibre....."
            />
            <Button
              className="w-[120px]"
              type="submit"
              disabled={isLoading || isAdding}
            >
              <span className="flex items-center gap-3">
                Añadir{' '}
                {isLoading ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </span>
            </Button>
          </div>
        </div>
      </form>

      {isEmpty && (
        <p className="text-muted-foreground mt-4">
          No hay artículos en tu lista de deseos
        </p>
      )}
      {isFirstLoading ? (
        <BentoGrid loading items={[]} />
      ) : (
        <BentoGrid items={items} />
      )}
    </motion.div>
  )
}
