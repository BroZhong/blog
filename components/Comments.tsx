'use client'

import { Comments as CommentsComponent, type CommentsConfig } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const comments = siteMetadata.comments

  if (!comments?.provider || !['disqus', 'giscus', 'utterances'].includes(comments.provider)) {
    return null
  }
  const commentsConfig = comments as CommentsConfig

  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={commentsConfig} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
