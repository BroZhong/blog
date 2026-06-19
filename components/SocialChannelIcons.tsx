'use client'

import { useEffect, useState } from 'react'
import Image from '@/components/Image'
import socialChannels from '@/lib/socialChannels'

function WechatOfficialAccountIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="#07c160">
      <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356" />
      <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0" />
    </svg>
  )
}

function XiaohongshuIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect width="24" height="24" rx="6" fill="#ff2442" />
      <text
        x="12"
        y="14.5"
        fill="#fff"
        textAnchor="middle"
        fontSize="6.3"
        fontWeight="800"
        fontFamily="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif"
      >
        小红书
      </text>
    </svg>
  )
}

function ChannelIcon({ kind, className }: { kind: string; className: string }) {
  if (kind === 'wechat') {
    return <WechatOfficialAccountIcon className={className} />
  }

  return <XiaohongshuIcon className={className} />
}

export default function SocialChannelIcons() {
  const [activeChannel, setActiveChannel] = useState<(typeof socialChannels)[number] | null>(null)

  useEffect(() => {
    if (!activeChannel) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveChannel(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeChannel])

  return (
    <>
      {socialChannels.map((channel) => (
        <button
          key={channel.kind}
          type="button"
          aria-haspopup="dialog"
          aria-label={channel.name}
          onClick={() => setActiveChannel(channel)}
          className="text-sm text-gray-500 transition hover:text-gray-600"
        >
          <span className="sr-only">{channel.name}</span>
          <ChannelIcon
            kind={channel.kind}
            className="h-8 w-8 text-gray-700 transition hover:scale-105 dark:text-gray-200"
          />
        </button>
      ))}

      {activeChannel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="social-channel-title"
          className="fixed inset-0 z-80 flex items-center justify-center px-4 py-8"
        >
          <button
            type="button"
            aria-label="关闭弹窗"
            className="absolute inset-0 bg-gray-950/70"
            onClick={() => setActiveChannel(null)}
          />
          <div className="relative w-full max-w-xs rounded-md border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2
                  id="social-channel-title"
                  className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
                >
                  {activeChannel.name}
                </h2>
                {activeChannel.handle && (
                  <p className="text-primary-500 dark:text-primary-400 text-sm font-semibold">
                    {activeChannel.handle}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setActiveChannel(null)}
                className="rounded-sm px-2 py-1 text-xl leading-none text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ×
              </button>
            </div>

            {activeChannel.description && (
              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {activeChannel.description}
              </p>
            )}

            {activeChannel.qrSrc && (
              <div className="mt-5 flex justify-center">
                <div className="overflow-hidden rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700">
                  <Image
                    src={activeChannel.qrSrc}
                    alt={activeChannel.qrAlt || `${activeChannel.name}二维码`}
                    width={208}
                    height={208}
                    className="h-52 w-52 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
