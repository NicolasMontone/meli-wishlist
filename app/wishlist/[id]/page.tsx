import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'
import { Wishlist } from '@/components/wishlist'
import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: user } = await params

  console.log('Fetching wishlist for user:', user)
  const wishlistsUrls = await sql<{
    data: string[]
  }>`SELECT data FROM wishlists WHERE name = ${user}`

  const urls: string[] = wishlistsUrls.rows[0].data

  if (!urls) {
    redirect('/')
  }

  if (urls.length === 0) {
    redirect('/')
  }

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
