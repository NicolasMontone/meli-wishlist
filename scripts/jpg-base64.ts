import sharp from 'sharp'

export const getJpgBase64 = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const processedBuffer = await sharp(Buffer.from(arrayBuffer))
      .resize(100, 100, {
        fit: 'cover',
        background: '#fff',
      })
      .jpeg({ quality: 70 })
      .flatten({ background: '#fff' })
      .toBuffer()
    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`
  } catch (error) {
    console.error('Error processing image:', error)
    return null
  }
}

async function main() {
  const url = process.argv[2]
  if (!url) {
    console.error('Please provide an image URL as an argument')
    process.exit(1)
  }

  const base64 = await getJpgBase64(url)
  console.log(base64)
}

main()
