import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { resolveAbsoluteImageUrl } from '@/lib/imageUrls'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const metadataImage = image
    ? resolveAbsoluteImageUrl(image, siteMetadata.siteUrl)
    : siteMetadata.socialBanner

  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: [metadataImage],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: [metadataImage],
    },
    ...rest,
  }
}
