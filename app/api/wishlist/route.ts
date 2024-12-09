import { sql } from '@vercel/postgres'
import { randomBytes } from 'node:crypto'
import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.username.length > 120) {
      return Response.json({ error: 'Username too long' }, { status: 400 })
    }
    // If only username is provided, create new user with session
    if (body.username && !body.urls) {
      const sessionId = randomBytes(32).toString('base64')
      const existingUser = await sql`
				SELECT name FROM wishlists 
				WHERE name = ${body.username}
			`

      if (existingUser.rows.length > 0) {
        return Response.json(
          { message: 'Username already taken' },
          { status: 409 }
        )
      }

      await sql`
				INSERT INTO wishlists (name, session_id, data) 
				VALUES (${body.username}, ${sessionId}, '[]')
			`

      return Response.json({
        success: true,
        username: body.username,
        sessionId,
      })
    }

    // If urls are provided, update existing wishlist
    if (body.urls && body.sessionId) {
      await sql`
				UPDATE wishlists 
				SET data = ${JSON.stringify(body.urls)}
				WHERE session_id = ${body.sessionId}
			`
      const newWishlist = await sql`
				SELECT data FROM wishlists 
				WHERE session_id = ${body.sessionId}
			`
      const urls = newWishlist.rows[0].data

      const wishlistsItems = await Promise.all(
        urls.map(async (url: string) => ({
          url,
          data: await fetchMercadoLibreData(url),
        }))
      )

      return Response.json({
        success: true,
        wishlist: wishlistsItems,
        username: body.username,
      })
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return Response.json({ error: 'Session ID is required' }, { status: 400 })
  }

  const query =
    await sql`SELECT data FROM wishlists WHERE session_id = ${sessionId}`

  if (query.rows.length === 0) {
    return Response.json({ wishlist: [] })
  }

  const wishlistsItems = await Promise.all(
    query.rows[0].data.map(async (url: string) => ({
      url,
      data: await fetchMercadoLibreData(url),
    }))
  )

  return Response.json({ wishlist: wishlistsItems })
}
