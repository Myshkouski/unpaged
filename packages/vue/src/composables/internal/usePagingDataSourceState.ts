import { reactive, toRefs } from "vue"
import type { PagingDataSourceState } from "@unpaged/core"

export function usePagingDataSourceState<TKey, TData, TMetadata>() {
  return toRefs(
    reactive({
      isPending: false,
      pages: new Map(),
    }) satisfies PagingDataSourceState<TKey, TData, TMetadata>
  )
}
