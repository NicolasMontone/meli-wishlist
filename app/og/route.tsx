import { sql } from '@vercel/postgres'
import { ImageResponse } from 'next/og'
import { fetchMercadoLibreData } from '../../utils/fetchMercadoLibreUrl'

export const runtime = 'edge'

export async function GET(req: Request) {
  const size = {
    width: 1200,
    height: 630,
  }

  const url = new URL(req.url)
  const name = url.searchParams.get('name')

  try {
    const wishlistsUrls = await sql<{
      data: string[]
    }>`SELECT data FROM wishlists WHERE name = ${name}`

    if (
      !wishlistsUrls.rows[0] ||
      !wishlistsUrls.rows[0].data ||
      wishlistsUrls.rows[0].data.length === 0
    ) {
      return new ImageResponse(
        (
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
            {name || 'No wishlist found'}
          </div>
        ),
        { ...size }
      )
    }

    const urls: string[] = wishlistsUrls.rows[0].data
    const wishlistsItems = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const data = await fetchMercadoLibreData(url)
          return { url, data }
        } catch (error) {
          console.error(`Failed to fetch data for URL: ${url}`, error)
          return { url, data: null }
        }
      })
    )

    const validItems = wishlistsItems.filter((item) => item.data?.imageSrc)

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
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          >
            {validItems.map(({ data }, index) => {
              if (!data?.imageSrc) return null
              return (
                <img
                  key={`${data.imageSrc}-${index}`}
                  src={data.imageSrc}
                  style={{
                    width: `${100 / validItems.length}%`,
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt={data.title || ''}
                />
              )
            })}
          </div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />
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
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
