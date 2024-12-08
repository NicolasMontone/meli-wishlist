import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
	try {
		const users = await sql`SELECT name FROM wishlists`
		console.log(users.rows.map((row) => row.name))
		return Response.json(users.rows.map((row) => row.name))
	} catch (error) {
		return Response.json(
			{ error },
			{ status: 500 }
		)
	}
} 