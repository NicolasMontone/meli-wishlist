import { NextResponse } from 'next/server'
import { isMeliUrl } from '@/utils/isMeliUrl'
import { fetchMercadoLibreData } from '@/utils/fetchMercadoLibreUrl'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  if (!isMeliUrl(url)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const data = await fetchMercadoLibreData(url)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
