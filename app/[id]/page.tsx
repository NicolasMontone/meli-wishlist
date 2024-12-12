import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'

import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import BentoGrid from '@/components/bento'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Lista de deseos de ${id}`,
    openGraph: {
      images: [`https://obsequi.ar/og?name=${id}`],
    },
    description: 'Para que sepas que regalarme para Navidad ',
    twitter: {
      images: [`https://obsequi.ar/og?name=${id}`],
    },
    robots: {
      index: false,
      follow: false,
    },
    metadataBase: new URL('https://obsequi.ar'),
    alternates: {
      canonical: `/${id}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="p-4">
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
