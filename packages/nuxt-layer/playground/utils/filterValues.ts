export function filterValues<K, V>(
  map: Map<K, V>,
  predicate: (value: V, index: number) => boolean
) {
  const entries = [...map.entries()].filter(([_, value], index) => {
    return predicate(value, index)
  })

  return new Map(entries)
}
