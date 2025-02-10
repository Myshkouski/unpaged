import { ref, type Ref, computed } from "vue"
import { usePagingDataSource } from "./usePagingDataSource"
import type { UsePagingDataSourceHooks } from "./internal/usePagingDataSource"

export function usePagingData<TKey, TData, TMetadata>(options: UsePagingDataOptions<TKey, TData, TMetadata>) {
  const keys = options.keys ?? (ref(new Set()) as Ref<Set<TKey>>)
  const keysArray = computed(() => {
    return [...keys.value]
  })

  const { pages, pending, refresh: _refresh, invalidate: _invalidate } = usePagingDataSource<TKey, TData, TMetadata>({
    keys: keysArray,
    page: options.page,
    metadata: options.metadata
  })

  async function load(...values: TKey[]) {
    for (const k of values) {
      keys.value.add(k)
    }
  }

  async function refresh(...values: TKey[]) {
    await _refresh(values)
  }

  function invalidate(...values: TKey[]) {
    for (const k of values) {
      pages.value.delete(k)
    }
  }

  return {
    load,
    refresh,
    invalidate,
    data: computed(() => pages.value),
    pending,
  }
}

export type UsePagingDataOptions<K, T, M> =
  UsePagingDataSourceHooks<K, T, M> &
  {
    keys?: Ref<Set<K>>
  }
