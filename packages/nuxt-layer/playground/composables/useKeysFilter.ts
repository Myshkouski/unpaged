export function useKeysFilter<K, V, T extends K>(
  map: MaybeRefOrGetter<Map<K, V>>,
  predicate: (value: K, index: number) => boolean
) {
  return computed(() => {
    return filterKeys(toValue(map), predicate);
  });
}
