import Image from '@/components/Image'
import Link from '@/components/Link'

type BlogPostCoverProps = {
  images?: string | string[]
  title: string
  href?: string
  priority?: boolean
  className?: string
}

export function getBlogPostCover(images?: string | string[]) {
  if (typeof images === 'string') {
    return images
  }

  return images?.[0]
}

export default function BlogPostCover({
  images,
  title,
  href,
  priority = false,
  className = '',
}: BlogPostCoverProps) {
  const src = getBlogPostCover(images)

  if (!src) {
    return null
  }

  const cover = (
    <div
      className={`relative aspect-[16/7] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900 ${className}`}
    >
      <Image
        src={src}
        alt={`${title} 封面`}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 768px, (min-width: 768px) 70vw, 100vw"
        className="object-cover"
      />
    </div>
  )

  if (!href) {
    return cover
  }

  return (
    <Link href={href} aria-label={`阅读全文: ${title}`} className="block">
      {cover}
    </Link>
  )
}
