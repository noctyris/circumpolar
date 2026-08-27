import type { MetadataRoute } from 'next'
import { fetchImages } from './lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://circumpolar.dpdns.org'

  const pictures = await fetchImages()

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
