'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
  useRegisterActions,
} from 'kbar'
import type { Action } from 'kbar'
import { formatDate } from '@/lib/formatDate'

interface KBarSearchProps {
  searchDocumentsPath: string | false
  defaultActions?: Action[]
  onSearchDocumentsLoad?: (json: unknown) => Action[]
}

export type SearchConfig =
  | {
      provider: 'kbar'
      kbarConfig: KBarSearchProps
    }
  | {
      provider: 'algolia'
    }
  | false
  | null
  | undefined

interface SearchProviderProps {
  searchConfig: SearchConfig
  children: React.ReactNode
}

interface SearchDocument {
  path: string
  title: string
  summary?: string
  date: string
}

const mapPostsToActions = (posts: SearchDocument[], router: ReturnType<typeof useRouter>) =>
  posts.map((post) => ({
    id: post.path,
    name: post.title,
    keywords: post.summary || '',
    section: 'Content',
    subtitle: formatDate(post.date, 'en-US'),
    perform: () => router.push(`/${post.path}`),
  }))

const KBarSearchProvider = ({
  kbarConfig,
  children,
}: {
  kbarConfig: KBarSearchProps
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { searchDocumentsPath, defaultActions = [], onSearchDocumentsLoad } = kbarConfig
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!searchDocumentsPath) {
        setDataLoaded(true)
        return
      }

      const url =
        searchDocumentsPath.includes('://') || searchDocumentsPath.startsWith('//')
          ? searchDocumentsPath
          : new URL(searchDocumentsPath, window.location.origin)
      const res = await fetch(url)
      const json = await res.json()
      const actions = onSearchDocumentsLoad
        ? onSearchDocumentsLoad(json)
        : mapPostsToActions(json as SearchDocument[], router)

      setSearchActions(actions)
      setDataLoaded(true)
    }

    if (!dataLoaded) {
      fetchData()
    }
  }, [dataLoaded, onSearchDocumentsLoad, router, searchDocumentsPath])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}

const KBarModal = ({ actions, isLoading }: { actions: Action[]; isLoading: boolean }) => {
  useRegisterActions(actions, [actions])

  return (
    <KBarPortal>
      <KBarPositioner className="z-50 bg-gray-100/70 p-4 backdrop-blur-sm dark:bg-gray-950/70">
        <KBarAnimator className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
              <KBarSearch className="h-10 w-full border-0 bg-transparent px-0 py-0 text-lg text-gray-900 placeholder-gray-400 shadow-none ring-0 focus:border-transparent focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500" />
              <kbd className="inline-flex h-7 items-center rounded-md border border-gray-300 px-2 text-xs font-medium tracking-wide whitespace-nowrap text-gray-500 dark:border-gray-700 dark:text-gray-400">
                ESC
              </kbd>
            </div>
            {!isLoading && <RenderResults />}
            {isLoading && (
              <div className="border-t border-gray-100 px-4 py-8 text-center text-gray-400 dark:border-gray-800 dark:text-gray-600">
                Loading...
              </div>
            )}
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

const RenderResults = () => {
  const { results } = useMatches()

  if (!results.length) {
    return (
      <div className="border-t border-gray-100 px-4 py-8 text-center text-gray-400 dark:border-gray-800 dark:text-gray-600">
        No results for your search...
      </div>
    )
  }

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        if (typeof item === 'string') {
          return (
            <div className="pt-3">
              <div className="text-primary-600 dark:text-primary-300 border-t border-gray-100 px-4 pt-5 pb-2 text-xs font-semibold uppercase dark:border-gray-800">
                {item}
              </div>
            </div>
          )
        }

        const action = item as Action

        return (
          <div
            className={`flex cursor-pointer justify-between border-l-2 px-4 py-3 transition-colors ${
              active
                ? 'border-primary-500 dark:border-primary-400 bg-gray-100 text-gray-950 dark:bg-gray-800/80 dark:text-gray-50'
                : 'border-transparent bg-transparent text-gray-700 dark:text-gray-100'
            }`}
          >
            <div className="flex space-x-2">
              {action.icon && <div className="self-center">{action.icon}</div>}
              <div className="block">
                {action.subtitle && (
                  <div className={`${active ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                    {action.subtitle}
                  </div>
                )}
                <div>{action.name}</div>
              </div>
            </div>
            {action.shortcut?.length ? (
              <div aria-hidden className="flex flex-row items-center justify-center gap-x-2">
                {action.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className={`flex h-7 w-6 items-center justify-center rounded border text-xs font-medium ${
                      active ? 'border-gray-400 text-gray-500' : 'border-gray-400 text-gray-400'
                    }`}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }}
    />
  )
}

const SearchProvider = ({ searchConfig, children }: SearchProviderProps) => {
  if (!searchConfig || searchConfig.provider !== 'kbar') {
    return <>{children}</>
  }

  return <KBarSearchProvider kbarConfig={searchConfig.kbarConfig}>{children}</KBarSearchProvider>
}

export default SearchProvider
