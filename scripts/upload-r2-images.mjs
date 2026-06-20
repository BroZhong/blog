import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const imageRoot = path.resolve('public/static/images')
const publicRoot = path.resolve('public')
const bucket = process.env.R2_BUCKET
const wranglerBin = process.env.WRANGLER_BIN || 'wrangler'
const cacheControl = process.env.R2_CACHE_CONTROL || 'public, max-age=31536000, immutable'
const jurisdiction = process.env.R2_JURISDICTION
const dryRun = process.env.DRY_RUN === '1'
const concurrency = Number(process.env.R2_UPLOAD_CONCURRENCY || 1)

const mimeTypes = new Map([
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
])

if (!bucket) {
  console.error('Missing R2_BUCKET. Example: R2_BUCKET=blog-assets yarn r2:upload-images')
  process.exit(1)
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return listImages(fullPath)
      }

      const contentType = mimeTypes.get(path.extname(entry.name).toLowerCase())
      return contentType ? [{ fullPath, contentType }] : []
    })
  )

  return files.flat()
}

function toObjectKey(filePath) {
  return path.relative(publicRoot, filePath).split(path.sep).join('/')
}

function runWrangler(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(wranglerBin, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${wranglerBin} ${args.join(' ')} exited with code ${code}`))
      }
    })
  })
}

async function uploadImage({ fullPath, contentType }) {
  const key = toObjectKey(fullPath)
  const args = [
    'r2',
    'object',
    'put',
    `${bucket}/${key}`,
    '--file',
    fullPath,
    '--content-type',
    contentType,
    '--cache-control',
    cacheControl,
    '--remote',
    '--force',
  ]

  if (jurisdiction) {
    args.push('--jurisdiction', jurisdiction)
  }

  if (dryRun) {
    console.log(`[dry-run] ${wranglerBin} ${args.join(' ')}`)
    return
  }

  await runWrangler(args)
}

async function runLimited(items, worker, limit) {
  const executing = new Set()

  for (const item of items) {
    const promise = Promise.resolve().then(() => worker(item))
    executing.add(promise)
    promise.finally(() => executing.delete(promise))

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
}

const images = await listImages(imageRoot)
console.log(
  `${dryRun ? 'Would upload' : 'Uploading'} ${images.length} images to R2 bucket "${bucket}"`
)

await runLimited(images, uploadImage, concurrency)

console.log('Done')
