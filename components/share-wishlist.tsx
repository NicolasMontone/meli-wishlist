'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWishlist } from '../hooks/use-wishlist'
import { useMemo } from 'react'

export function ShareWishlist() {
  const { wishlist } = useWishlist()

  const shareUrl = useMemo(() => {
    const encodedUrls = encodeURIComponent(
      wishlist.map((item) => item.url).join(',')
    )
    return `${window.location.origin}/wishlist?w=${encodedUrls}`
  }, [wishlist])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparte Tu Lista de Deseos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="share-url">URL para compartir</Label>
          <Input id="share-url" type="text" value={shareUrl} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Código QR</Label>
          <div className="flex justify-center">
            <QRCodeCanvas value={shareUrl} size={200} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
