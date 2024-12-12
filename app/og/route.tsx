import { ImageResponse } from 'next/og'
import { sql } from '@vercel/postgres'
import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'
import sharp from 'sharp'

export async function GET(req: Request) {
  const size = {
    width: 1200,
    height: 630,
  }

  const url = new URL(req.url)
  const name = decodeURIComponent(
    url.searchParams.get('name') || ''
  ).toLowerCase()

  const user = decodeURIComponent(name)

  const wishlistsUrls = await sql<{
    data: string[]
  }>`SELECT data FROM wishlists WHERE name = ${user}`

  if (!wishlistsUrls.rows[0]) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: 'white',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-gift"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontStyle: 'normal',
              color: 'black',
              marginTop: 30,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            <b>Lista de deseos de {name}</b>
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  }
  const urls: string[] = wishlistsUrls.rows[0].data

  if (!urls || urls.length === 0) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: 'white',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-gift"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontStyle: 'normal',
              color: 'black',
              marginTop: 30,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            <b>Lista de deseos de {name}</b>
          </div>
        </div>
      ),
      {
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

  const imagesUrls = wishlistsItems
    .map((item) => item.data.imageSrc)
    .slice(0, 3)
    .filter((url) => url !== null)

  // Process images to base64
  const previewImageBase64 = await Promise.all(
    imagesUrls.map(async (imageUrl) => {
      try {
        const response = await fetch(imageUrl)
        const arrayBuffer = await response.arrayBuffer()
        const processedBuffer = await sharp(Buffer.from(arrayBuffer))
          .resize(1000, 1000, { fit: 'cover', background: 'white' })
          .jpeg({ quality: 100 })
          .flatten({ background: 'white' })
          .toBuffer()
        return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`
      } catch (error) {
        console.error('Error processing image:', error)
        return null
      }
    })
  )

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            flexWrap: 'nowrap',
          }}
        >
          {previewImageBase64.map((image, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: no need
              key={index}
              style={{
                borderRadius: '10px',
                padding: '8px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <img
                style={{ objectFit: 'contain' }}
                width="300px"
                height="300px"
                src={image || ''}
                alt={`Imagen ${index + 1}`}
              />{' '}
            </div>
          ))}
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
