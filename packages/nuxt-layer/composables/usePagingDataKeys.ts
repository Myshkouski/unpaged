export function usePagingDataKeys<K, I extends Iterable<K>>(keys: MaybeRefOrGetter<I>, compareFn?: KeyCompareFn<K>) {
  const keyArray = computed(() => {
    return [...toValue(keys)]
  })

  return computed(() => {
    return compareFn
      ? keyArray.value.toSorted(compareFn)
      : keyArray.value
  })
}

export type KeyCompareFn<K> = (a: K, b: K) => number
