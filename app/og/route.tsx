import { sql } from '@vercel/postgres'
import { ImageResponse } from 'next/og'
import { fetchMercadoLibreData } from '../../utils/fetchMercadoLibreUrl'

export const runtime = 'edge'

// Image metadata
export const alt = 'Mi lista de deseos'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export async function GET(req: Request) {
  const url = new URL(req.url)

  const name = url.searchParams.get('name')

  const wishlistsUrls = await sql<{
    data: string[]
  }>`SELECT data FROM wishlists WHERE name = ${name}`

  if (!wishlistsUrls.rows[0]) {
    return new ImageResponse(
      (
        // ImageResponse JSX element
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {name}
        </div>
      ),
      {
        // For convenience, we can re-use the exported opengraph-image
        // size config to also set the ImageResponse's width and height.
        ...size,
      }
    )
  }

  const urls: string[] = wishlistsUrls.rows[0].data
  if (!urls || urls.length === 0) {
    return new ImageResponse(
      (
        // ImageResponse JSX element
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {name}
        </div>
      ),
      {
        // For convenience, we can re-use the exported opengraph-image
        // size config to also set the ImageResponse's width and height.
        ...size,
      }
    )
  }
  const wishlistsItems = await Promise.all(
    urls.map(async (url: string) => ({
      url,
      data: await fetchMercadoLibreData(url),
    }))
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Images container */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          {wishlistsItems.map(({ data }, index) => {
            if (!data.imageSrc) return null
            return (
              <img
                key={data.imageSrc}
                src={data.imageSrc}
                style={{
                  width: `${100 / wishlistsItems.length}%`,
                  height: '100%',
                  objectFit: 'cover',
                }}
                alt={data.title ?? ''}
              />
            )
          })}
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Name text */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 96,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {name}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
