'use client'

import { useState } from 'react'
import type { Wishlist } from '../types'
import { useToast } from '../hooks/use-toast'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

import { WishlistItem } from './wishlist-item'
import { isMeliUrl } from '../utils/isMeliUrl'
import { useWishlist } from '../hooks/use-wishlist'
import { ShareWishlist } from './share-wishlist'

export function CreateWishlist() {
  const { wishlist, setWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const { toast } = useToast()

  const addUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isMeliUrl(newUrl)) {
      toast({
        title: 'URL inválida',
        description: 'Por favor, introduce una URL válida de Mercado Libre.',
        variant: 'destructive',
      })
      return
    }
    try {
      setIsLoading(true)
      const itemExists = wishlist.some((item) => item.url === newUrl)
      if (itemExists) {
        toast({
          title: 'Artículo ya existe',
          description: 'El artículo ya existe en tu lista de deseos.',
          variant: 'destructive',
        })
        return
      }
      const response = await fetch(
        `/api/meli?url=${encodeURIComponent(newUrl)}`
      )
      const data = await response.json()
      const newWishlist = [...wishlist, { url: newUrl, data }]
      setWishlist(newWishlist)
      setNewUrl('')

      toast({
        title: 'Artículo añadido',
        description: 'El artículo ha sido añadido a tu lista de deseos.',
      })
    } catch (error) {
      console.error('Error al obtener datos del artículo:', error)
      toast({
        title: 'Error',
        description:
          'No se pudo añadir el artículo. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeUrl = (url: string) => {
    const newWishlist = wishlist.filter((item) => item.url !== url)
    setWishlist(newWishlist)

    toast({
      title: 'Artículo eliminado',
      description: 'El artículo ha sido eliminado de tu lista de deseos.',
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Artículo</CardTitle>
        </CardHeader>
        <form onSubmit={addUrl}>
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
    </div>
  )
}
