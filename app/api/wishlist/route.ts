import { sql } from "@vercel/postgres"

export async function POST(request: Request) {
	try {
		const { username, urls } = await request.json()
		if (!username || !urls || !Array.isArray(urls)) {
			return Response.json(
				{ error: 'Invalid username or urls' },
				{ status: 400 }
			)
		}
		const existingUser = await sql`SELECT name FROM wishlists WHERE name = ${username}`
		if (existingUser.rows.length > 0) {
			return Response.json(
				{ message: 'Username already taken' },
				{ status: 409 }
			)
		}
		await sql`INSERT INTO wishlists (data, name) VALUES (${JSON.stringify(urls)}, ${username})`
		return Response.json({ success: true, username, urls })
	} catch (error) {
		return Response.json(
			{ error },
			{ status: 500 }
		)
	}
}