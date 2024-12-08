import { useLocalStorage } from 'usehooks-ts'
import type { Wishlist } from '../types'

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<Wishlist[]>('wishlist', [])

  return { wishlist, setWishlist }
}
