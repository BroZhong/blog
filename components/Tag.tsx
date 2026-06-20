import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-2 mb-1 inline-flex rounded-full border border-gray-200 px-2.5 py-0.5 text-xs leading-5 font-semibold text-gray-500 uppercase transition-colors hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-pink-400 dark:hover:bg-pink-950/30 dark:hover:text-pink-300"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
