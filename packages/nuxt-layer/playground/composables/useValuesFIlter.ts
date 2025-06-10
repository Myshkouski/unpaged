export function useValuesFIlter<K, V,>(
  map: MaybeRefOrGetter<Map<K, V>>,
  predicate: (value: V, index: number) => boolean
) {
  return computed(() => {
    return filterValues(toValue(map), predicate)
  })
}
