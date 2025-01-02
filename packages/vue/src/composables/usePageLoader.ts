import { watch, type Ref } from "vue"
import type { usePagingData } from "./usePagingData"

export function usePageLoader<TKey extends number, TData, TMetadata>(options: UsePageLoaderOptions<TKey, TData, TMetadata>) {
  const { page, load, data, invalidate, preload, unload } = options

  watch(page, async page => {
    const invalidKeys = unload ? [...data.value.keys()].filter(key => {
      return unload(key, page)
    }) : undefined
    if (invalidKeys && invalidKeys.length > 0) {
      invalidate(...invalidKeys)
    }

    const prefetched = preload ? preload(page) : undefined
    if (prefetched && prefetched.length > 0) {
      await load(page, ...prefetched)
    }
  }, {
    immediate: true,
  })
}

export type UsePageLoaderOptions<K, T, M> =
  Pick<ReturnType<typeof usePagingData<K, T, M>>, "data" | "load" | "invalidate"> &
  {
    page: Ref<K>
    // prefetch?: (key: K, page: Page<T, M>) => number[]
    preload?: (key: K) => Optional<K[]>
    unload?: (currentKey: K, key: K) => boolean
  }
