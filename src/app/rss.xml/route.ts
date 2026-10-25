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

// Un HEAD par image à chaque génération du flux représentait 48+ appels
// sortants par requête. Les tailles ne changent pas : on les garde 24 h.
const SIZE_TTL_MS = 24 * 60 * 60 * 1000
const sizeCache = new Map<string, { length: number; expires: number }>()

async function fetchByteLength(url: string): Promise<number> {
  const cached = sizeCache.get(url)
  if (cached && cached.expires > Date.now()) {
    return cached.length
  }

  try {
    const res = await fetch(url, { method: 'HEAD' })
    const len = res.headers.get('content-length')
    const length = len ? parseInt(len, 10) : 0
    if (Number.isFinite(length) && length > 0) {
      sizeCache.set(url, { length, expires: Date.now() + SIZE_TTL_MS })
    }
    return length
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
