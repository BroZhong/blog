import NextImage, { ImageProps } from 'next/image'
import { resolveImageSrc, shouldBypassVercelImageOptimizer } from '@/lib/imageUrls'

const Image = ({ src, unoptimized, ...rest }: ImageProps) => {
  if (typeof src !== 'string') {
    return <NextImage src={src} unoptimized={unoptimized} {...rest} />
  }

  const shouldBypassOptimizer = shouldBypassVercelImageOptimizer(src)

  return (
    <NextImage
      src={resolveImageSrc(src)}
      unoptimized={unoptimized ?? (shouldBypassOptimizer ? true : undefined)}
      {...rest}
    />
  )
}

export default Image
