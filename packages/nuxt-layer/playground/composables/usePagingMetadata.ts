import { hasData, type PagesMap } from "@unpaged/core"

export function usePagingMetadata<TKey, TData, TMeta>(pagingData: MaybeRefOrGetter<PagesMap<TKey, TData, TMeta>>) {
  return computed(() => {
    return mapValues(toValue(pagingData), page => {
      return hasData(page) ? page.metadata : undefined
    })
  })
}
