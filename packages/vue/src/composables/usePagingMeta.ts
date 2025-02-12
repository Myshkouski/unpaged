import { hasData, type PagesMap } from "@unpaged/core"
import { type MaybeRefOrGetter, computed, toValue } from "vue"

export function usePagingMeta<TKey, TData, TMeta>(data: MaybeRefOrGetter<PagesMap<TKey, TData, TMeta>>) {
  return computed(() => {
    const entries = [...toValue(data).entries()].map(([key, page]) => {
      return [key, hasData(page) ? page.metadata : undefined] satisfies [TKey, Optional<TMeta>]
    })
    return new Map(entries)
  })
}
