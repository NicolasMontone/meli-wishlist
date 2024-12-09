import { useEffect, useState } from 'react'
import type { Wishlist } from '@/types'
import { useToast } from './use-toast'
import { isMeliUrl } from '../utils/isMeliUrl'

export function useWishlist(sessionId: string) {
  const [wishlist, setWishlist] = useState<Wishlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  useEffect(() => {
    fetch(`/api/wishlist?sessionId=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        setWishlist(data.wishlist)
        setIsLoading(false)
      })
  }, [sessionId])

  const onAddUrl = async (newUrl: string) => {
    if (!isMeliUrl(newUrl)) {
      toast({
        title: 'URL inválida',
        description: 'Por favor, introduce una URL válida de Mercado Libre.',
        variant: 'destructive',
      })
      return
    }
    const itemExists = wishlist.some((item) => item.url === newUrl)
    if (itemExists) {
      toast({
        title: 'Artículo ya existe',
        description: 'El artículo ya existe en tu lista de deseos.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    const newWishlistUrls = wishlist.map((item) => item.url)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          urls: [...newWishlistUrls, newUrl],
        }),
      })
      const data = await response.json()
      setWishlist(data.wishlist)
    } catch (error) {
      toast({
        title: 'Error al guardar la lista de deseos',
        description: 'Por favor, intenta de nuevo',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onDeleteWishlist = async (url: string) => {
    const newWishlist = wishlist.filter((item) => item.url !== url)

    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          urls: newWishlist.map((item) => item.url),
        }),
      })
      const data = await response.json()
      setWishlist(data.wishlist)
    } catch (error) {
      toast({
        title: 'Error al eliminar la lista de deseos',
        description: 'Por favor, intenta de nuevo',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    wishlist,
    isLoading,
    addUrl: onAddUrl,
    deleteUrl: onDeleteWishlist,
  }
}
