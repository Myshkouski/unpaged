import type { PagesMap } from "./PagesMap"

export type PagingDataSourceState<TKey, TData, TMetadata> = {
  isPending: boolean
  pages: PagesMap<TKey, TData, TMetadata>
}
