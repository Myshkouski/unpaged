import { computed, toValue, watch, type MaybeRefOrGetter, type ToRefs } from "vue"
import type { PagingDataSourceState } from "@unpaged/core"
import { VuePagingDataSource, type VuePagingDataSourceActions } from "./VuePagingDataSource"

export function usePagingDataSource<TKey, TData, TMetadata>(
  state: ToRefs<PagingDataSourceState<TKey, TData, TMetadata>>,
  options: UsePagingDataSourceOptions<TKey, TData, TMetadata>
) {
  const datasource = new VuePagingDataSource<TKey, TData, Optional<TMetadata>>({
    async load(key: TKey) {
      return await options.load(key)
    },
    getPageMetadata(key, data) {
      if (!options.metadata) return
      return options.metadata(key, data)
    },
    ...state,
  })

  watch(options.keys, async (keys) => {
    await datasource.refresh(toValue(keys))
  }, {
    immediate: true
  })

  return {
    pages: computed(() => state.pages.value),
    pending: computed(() => state.isPending.value),
    async refresh() {
      await datasource.refresh(toValue(options.keys))
    },
  }
}

export type UsePagingDataSourceHooks<TKey, TData, TMetadata> =
  Pick<VuePagingDataSourceActions<TKey, TData, TMetadata>, "load" > &
  {
    metadata?: VuePagingDataSourceActions<TKey, TData, TMetadata>["getPageMetadata"]
  }

export type UsePagingDataSourceOptions<TKey, TData, TMetadata> =
  UsePagingDataSourceHooks<TKey, TData, TMetadata> &
  {
    keys: MaybeRefOrGetter<TKey[]>
  }
