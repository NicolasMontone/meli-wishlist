import * as cheerio from 'cheerio'

export async function fetchMercadoLibreData(url: string): Promise<{
  imageSrc: string | null
  title: string | null
  price: string | null
}> {
  const meliData = await fetch(url, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'max-age=0',
      dnt: '1',
      dpr: '2',
      ect: '4g',
      priority: 'u=0, i',
      rtt: '100',
      'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'viewport-width': '742',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
    redirect: 'follow',
  })
  const html = await meliData.text()

  const $ = cheerio.load(html)

  const imageSrc = $('figure img.ui-pdp-image').attr('src') ?? null
  const title = $('h1.ui-pdp-title').text().trim() ?? null
  const price = $('meta[itemprop="price"]').attr('content') ?? null

  return { imageSrc, title, price }
}
