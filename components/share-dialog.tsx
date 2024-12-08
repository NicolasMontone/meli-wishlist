'use client'

import { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ShareDialog({ children }: { children: React.ReactNode }) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const wishlistUrls = localStorage.getItem('wishlistUrls')
    if (wishlistUrls) {
      const encodedUrls = encodeURIComponent(wishlistUrls)
      setShareUrl(`${window.location.origin}?wishlist=${encodedUrls}`)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: '¡Copiado!',
        description: 'URL copiada al portapapeles',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar la URL',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Comparte Tu Lista de Deseos</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center bg-white p-3 rounded-lg">
            <QRCodeCanvas value={shareUrl} size={200} level="L" />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar URL
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
