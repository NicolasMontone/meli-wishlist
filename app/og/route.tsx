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
          .resize(100, 100, { fit: 'cover', background: 'white' })
          .jpeg({ quality: 100 })
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
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 40,
              fontStyle: 'normal',
              color: 'black',
              marginTop: 30,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            <img
              src={
                'data:image/jpeg;base64,/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABkAGQDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAEEBQMCBgf/xAA2EAABAwIDBAgEBQUAAAAAAAABAAIDBBEFEiETMUFhMlFScYGRocEGFCKxM0KS0eFDYmNzgv/EABoBAQADAQEBAAAAAAAAAAAAAAACAwQBBQb/xAAnEQACAgIBAwMEAwAAAAAAAAAAAQIDBBESBSExEyJRQWFxsSMy4f/aAAwDAQACEQMRAD8A/ZkREB5a8PBsdxIXpU8OfnjmP+V3rqrihXPnFSJTjxloIiKZEKL2UqnXzbI02ts07Qe5RnJRW2SjHk9IuIiKREIiIAiIgC41EzYozc/URZo4kr1LC2ZuVxcObXFp9Fk1tJNRNM0cjpI/zE9IDmeIWPLusqrcoR2XVQjJ6bOmG1DYqiSF5sHm7SeJWsvm9aiRkUYzOduWtS4e6GzpamZ57IeQ0fuvP6VkW2Q4uPZfUuyK4p8m9MvIoUr3DGFkY4+z6YDg/MtdYuKgy1jQNzMo87rD1CfChv8ABpxl/ImbINwCOKlcaV2elid/aLrstsXtJmdrT0ERF04EREAXmRgkjcx25wIK9IjWwYfw/HeWd7t8YEf3v7LcVLDaf5c1VxbPUOcO7RWy9rek4DvKyYdXo0KH5/ZfkS52No9IuXzEA/rR/qC8PrqZguZmnk3X7LQ7IRW2ypQk/CLCxZpM0738HPuO4aD7LrPiL5wWRNdEw73u6RHIcO8qs9wJ0FgBYDqC+e6pmwnFV1vZrpqce7NSgcNk6Pixx8jqFaWC2pmgLXxWLm6WO5w6j+6uxY3SuFps0DuIcNPMLfh9QpsgoyemvkhZRPfKK2aKKszEKOTo1UR/7C7CaJwuJGHucF6anF+GZ3GS8o9ooBB3FFIiSiIgIUOjY/pMae8L0ucz9nBI/stJ9Fx613Ore+xykw6jl6dNGeYbY+iqPwdsRz0pAPZfx8Qr9LLtqSGU73sa7zC6rPZj03R90S1W2QetmHk+sxua6KQaljvuOsLk9pYbFbVXStqosvRe3Vj+yVjZ9rDmIs5pIcOojevmOo4ax5JrwzVXZzWzwHE8bDrURwzVxtTR5mXsZX6N8OtTQ03z9WY332MQu8D8x4BfRNaGtDWgADQAcFb0/pqvj6tn9f2dtu9J6XkyIvh2m31LjKeofSP3V2HCqCD8OjhHPICfVW0X0deNTUtQikZJX2y8yZAAAsAAOSKUWgpCIiAKnismzwyc8SzKPHT3XWd1U0XhjjfyLyPZZNU+pqnhkwDA03yc1gzclU1Ps9vx2NFNe5KTfZGhhDs2GQt4sGQ+BsrqwmOqaR94HNIcdY3DeeXNadPLWSAGWnjjH+y58rKGDlK2pRae12fY7dX7nJPsy0sCpbs6+sYNxAkHiNfULeWNiwEdaXnc+nI8j/Kh1aHLH38P/BjP3tfJ1+H2WoXy21kkJvyGnstVU8Ji2WFUzTvyBx8dfdXFtxYenRCP2RXc+Vkn9wiItBUEREAREQBUsTYBSmYD6oiDflfUK6uVQza08kfaaR6Kq6tWVyg/qicHqSZUwxgeHzuFzmLWnqA/laCrYezJQxAjUtzHx191ZUMWtV0xj9jtr3NhZWPRl0EbhvN2fqH8LVVesh28bG9mRrvIruRX6tTh8naZcJpnZjQxjWDc0ABekRXlQREQBERAEREAREQEAAAAaAKURAEREAREQBERAEREB//Z'
              }
              style={{ objectFit: 'contain' }}
              width="32"
              height="32"
              alt="Imagen 1"
            />
            <b
              style={{
                background:
                  'linear-gradient(135deg, rgb(169, 201, 255) 0%, rgb(255, 187, 236) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              Lista de deseos de {name}
            </b>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {previewImageBase64.map((image, index) => (
              <img
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                style={{ objectFit: 'contain' }}
                width="100px"
                height="100px"
                src={image || ''}
                alt={`Imagen ${index + 1}`}
              />
            ))}
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
