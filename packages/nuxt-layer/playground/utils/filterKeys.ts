export function filterKeys<K, V>(
  map: Map<K, V>,
  predicate: (value: K, index: number) => boolean
) {
  const entries = [...map.entries()].filter(([key], index) => {
    return predicate(key, index);
  });

  return new Map(entries);
}
