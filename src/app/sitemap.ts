import type { MetadataRoute } from 'next'
import { fetchPictures } from '@/lib/data' // Adapte selon le nom réel de ta fonction dans lib/data.ts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://circumpolar.vercel.app'

  // Récupération de toutes les photos publiques
  const pictures = await fetchPictures()

  const pictureEntries: MetadataRoute.Sitemap = pictures.map((picture) => ({
    url: `${baseUrl}/image/${picture.id}`,
    lastModified: picture.upload_date ? new Date(picture.upload_date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...pictureEntries,
  ]
}
