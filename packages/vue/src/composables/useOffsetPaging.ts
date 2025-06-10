import { watch, type Ref } from "vue"

export function useOffsetPaging<TKey extends number, TData, TMetadata>(options: UsePageLoaderOptions<TKey, TData, TMetadata>) {
  const { page, keys, preload, validate } = options

  watch(page, async page => {
    const invalidKeys = validate ? [...keys.value.values()].filter(key => {
      return !validate(key, page)
    }) : undefined
    
    if (invalidKeys && invalidKeys.length > 0) {
      for (const key of invalidKeys) {
        keys.value.delete(key)
      }
    }

    const prefetched = preload ? preload(page) : undefined
    if (prefetched && prefetched.length > 0) {
      for (const key of prefetched) {
        keys.value.add(key)
      }
    }
  }, {
    immediate: true,
  })
}

export type UsePageLoaderOptions<K, T, M> = {
    keys: Ref<Set<K>>
    page: Ref<K>
    // prefetch?: (key: K, page: Page<T, M>) => number[]
    preload?: (key: K) => Optional<K[]>
    // unload?: (currentKey: K, key: K) => boolean
    validate?: (key: K, currentKey: K) => boolean
  }
