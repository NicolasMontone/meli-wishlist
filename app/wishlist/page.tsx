import { redirect } from 'next/navigation'

import { fetchMercadoLibreData } from '../../utils/fetchMercadoLibreUrl'
import { Wishlist } from '../../components/wishlist'

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>
}) {
  const searchParams_ = await searchParams
  if (!searchParams_.w) {
    return redirect('/')
  }

  console.log(decodeURIComponent(searchParams_.w))

  const urls = decodeURIComponent(searchParams_.w).split(',')

  const wishlist = await Promise.all(
    urls.map(async (url: string) => ({
      url,
      data: await fetchMercadoLibreData(url),
    }))
  )

  return (
    <div>
      <Wishlist wishlist={wishlist} />
    </div>
  )
}
