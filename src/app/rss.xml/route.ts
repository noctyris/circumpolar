import { fetchImages } from '@/app/lib/data'
import { getCldImageUrl } from 'next-cloudinary'

const baseUrl = 'https://circumpolar.dpdns.org'

function thumbnailUrl(publicId: string): string {
  return getCldImageUrl({
    width: '800',
    src: publicId,
    quality: 'auto',
    format: 'webp',
    transformations: [],
  })
}

async function fetchByteLength(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    const len = res.headers.get('content-length')
    return len ? parseInt(len, 10) : 0
  } catch {
    return 0
  }
}

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return ''
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function GET() {
  const pictures = await fetchImages()

  const items = await Promise.all(
    pictures.map(async (picture) => {
      const url = `${baseUrl}/image/${picture.id}`
      const title = picture.title || picture.target || 'Sans titre'
      const dateSource = picture.upload_date ?? picture.capture_date
      const pubDate = new Date(dateSource ?? Date.now()).toUTCString()
      const description = [picture.target, picture.optics, picture.camera]
        .filter(Boolean)
        .join(' — ')

      const thumb = thumbnailUrl(picture.publicid)
      const thumbLength = await fetchByteLength(thumb)

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <enclosure url="${thumb}" length="${thumbLength}" type="image/webp" />
      <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${thumb}" />
      <content:encoded><![CDATA[
        <img src="${thumb}" alt="${escapeXml(title)}" />
        <p>${escapeXml(description)}</p>
      ]]></content:encoded>
    </item>`
    })
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Circumpolar</title>
    <link>${baseUrl}</link>
    <description>Dernières photos astro publiées sur Circumpolar</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
