import { ref, type Ref, computed } from "vue";
import { usePagingDataSource } from "./usePagingDataSource";
import type { UsePagingDataSourceHooks } from "./internal/usePagingDataSource";

export function usePagingData<TKey, TData, TMetadata>(options: UsePagingDataOptions<TKey, TData, TMetadata>) {
  const keys = options.keys ?? (ref(new Set()) as Ref<Set<TKey>>)
  const keysArray = computed(() => {
    return [...keys.value]
  })

  const { pages, pending } = usePagingDataSource<TKey, TData, TMetadata>({
    keys: keysArray,
    load: options.load,
    metadata: options.metadata
  })

  async function load(...values: TKey[]) {
    for (const k of values) {
      keys.value.add(k)
    }
  }

  function invalidate(...values: TKey[]) {
    for (const k of values) {
      keys.value.delete(k)
    }
  }

  return {
    load,
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
