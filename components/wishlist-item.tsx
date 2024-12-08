import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

type WishlistItemProps = {
  item: {
    url: string
    data: {
      imageSrc: string | null
      title: string | null
      price: string | null
    }
  }
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { data } = item

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden rounded-lg shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            {data.imageSrc && (
              <div className="aspect-[4/3] relative">
                <Image
                  src={data.imageSrc}
                  alt={data.title || 'Imagen del producto'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg line-clamp-2 mb-1">
              {data.title || 'Sin título'}
            </h3>
            <p className="text-base font-semibold text-primary">
              {data.price ? `$ ${data.price}` : 'Precio no disponible'}
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
