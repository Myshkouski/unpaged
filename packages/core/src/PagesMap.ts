import type { Page } from "./Page"

export type PagesMap<TKey, TData, TMetadata> = Map<TKey, Page<TData, TMetadata>>
