import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'

import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import BentoGrid from '@/components/bento'
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="p-8">
      <Suspense fallback={<BentoGrid items={[]} loading />}>
        <WishlistPage params={params} />
      </Suspense>
    </div>
  )
}

async function WishlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = decodeURIComponent(id)

  const wishlistsUrls = await sql<{
    data: string[]
  }>`SELECT data FROM wishlists WHERE name = ${user}`

  if (!wishlistsUrls.rows[0]) {
    redirect('/')
  }
  const urls: string[] = wishlistsUrls.rows[0].data

  if (!urls || urls.length === 0) {
    redirect('/')
  }

  const wishlistsItems = await Promise.all(
    urls.map(async (url: string) => ({
      url,
      data: await fetchMercadoLibreData(url),
    }))
  )

  const [elPrimero, ...elResto] = wishlistsItems

  return (
    <BentoGrid
      items={[
        elPrimero,
        {
          user,
        },
        ...elResto,
      ]}
    />
  )
}
