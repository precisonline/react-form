// src/components/ThemeRegistry/EmotionCache.tsx
'use client'

import * as React from 'react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider as DefaultCacheProvider } from '@emotion/react'
import type { EmotionCache, Options as CacheOptions } from '@emotion/cache'

export type NextAppDirEmotionCacheProviderProps = {
  options: Omit<CacheOptions, 'insertionPoint'>
  CacheProvider?: (props: {
    value: EmotionCache
    children: React.ReactNode
  }) => React.JSX.Element | null
  children: React.ReactNode
}

export default function NextAppDirEmotionCacheProvider(
  props: NextAppDirEmotionCacheProviderProps
) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props

  const [registry] = React.useState(() => {
    const cache = createCache(options)
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = registry.flush()
    if (names.length === 0) {
      return null
    }
    let html = ''
    let styles = ''
    for (const name of names) {
      styles += registry.cache.inserted[name]
    }
    if (styles) {
      html = `<style data-emotion="${options.key} ${names.join(
        ' '
      )}">${styles}</style>`
    }
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  })

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>
}
