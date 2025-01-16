import { computed, toValue, watch, type MaybeRefOrGetter, type ToRefs } from "vue"
import type { PagingDataSourceState } from "@unpaged/core"
import { VuePagingDataSource, type VuePagingDataSourceActions } from "./VuePagingDataSource"

export function usePagingDataSource<TKey, TData, TMetadata>(
  state: ToRefs<PagingDataSourceState<TKey, TData, TMetadata>>,
  options: UsePagingDataSourceOptions<TKey, TData, TMetadata>
) {
  const datasource = new VuePagingDataSource<TKey, TData, Optional<TMetadata>>({
    async loadPage(key: TKey) {
      return await options.page(key)
    },
    getPageMetadata(key, data) {
      if (!options.metadata) return
      return options.metadata(key, data)
    },
    ...state,
  })

  watch(options.keys, async (keys) => {
    await datasource.load(toValue(keys))
  }, {
    immediate: true
  })

  return {
    pages: computed(() => state.pages.value),
    pending: computed(() => state.isPending.value),
    async load() {
      await datasource.load(toValue(options.keys))
    },
    async refresh(keys: TKey[]) {
      await datasource.refresh(keys)
    },
  }
}

export type UsePagingDataSourceHooks<TKey, TData, TMetadata> =
  {
    page: VuePagingDataSourceActions<TKey, TData, TMetadata>["loadPage"]
    metadata?: VuePagingDataSourceActions<TKey, TData, TMetadata>["getPageMetadata"]
  }

export type UsePagingDataSourceOptions<TKey, TData, TMetadata> =
  UsePagingDataSourceHooks<TKey, TData, TMetadata> &
  {
    keys: MaybeRefOrGetter<TKey[]>
  }
