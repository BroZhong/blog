const defaultImageBaseUrl = 'https://img.brozhong.com'
const remoteImageBaseUrl = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || defaultImageBaseUrl).replace(
  /\/+$/,
  ''
)
const basePath = process.env.BASE_PATH || ''

const absoluteUrlPattern = /^[a-z][a-z\d+\-.]*:/i

export function isAbsoluteUrl(src: string) {
  return absoluteUrlPattern.test(src)
}

export function resolveImageSrc(src: string) {
  if (isAbsoluteUrl(src)) {
    return src
  }

  const normalizedSrc = src.startsWith('/') ? src : `/${src}`

  if (remoteImageBaseUrl) {
    return `${remoteImageBaseUrl}${normalizedSrc}`
  }

  return `${basePath}${normalizedSrc}`
}

export function shouldBypassVercelImageOptimizer(src: string) {
  return Boolean(remoteImageBaseUrl) && !isAbsoluteUrl(src)
}

export function resolveAbsoluteImageUrl(src: string, siteUrl: string) {
  const resolvedSrc = resolveImageSrc(src)

  if (isAbsoluteUrl(resolvedSrc)) {
    return resolvedSrc
  }

  return `${siteUrl.replace(/\/+$/, '')}${resolvedSrc.startsWith('/') ? resolvedSrc : `/${resolvedSrc}`}`
}
