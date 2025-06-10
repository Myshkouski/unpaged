export function mapValues<K, V, T>(
  map: Map<K, V>,
  callbackfn: (value: V, key: K) => T
) {
  const entries = [...map.entries()].map(([key, value]) => {
    return [key, callbackfn(value, key)] satisfies [K, T]
  })

  return new Map(entries)
}
