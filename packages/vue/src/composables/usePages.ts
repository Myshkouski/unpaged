import type { PagesMap } from "@unpaged/core/src/PagesMap";
import { shallowRef } from "vue";

export function usePages<TKey, TData, TMetadata>() {
  const value: PagesMap<TKey, TData, TMetadata> = new Map()
  return shallowRef(value)
}
