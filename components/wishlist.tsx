import type { Wishlist as WishlistType } from '@/types'
import { WishlistItem } from './wishlist-item'

type WishlistProps = {
  wishlist: WishlistType[]
}

export function Wishlist({ wishlist }: WishlistProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <WishlistItem key={item.url} item={item} />
        ))}
      </div>
    </div>
  )
}
