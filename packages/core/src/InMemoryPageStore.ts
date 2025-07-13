import type { Page } from "./Page"
import type { PageStore } from "./PageStore"

export class InMemoryPageStore<TKey, TData, TMetadata> implements PageStore<TKey, TData, TMetadata> {
  protected readonly map: PagesMap<TKey, TData, TMetadata>

  constructor(options?: InMemoryPageStoreOptions<TKey, TData, TMetadata>) {
    this.map = toValue(options?.initial) ?? new Map()
  }

  find(key: TKey): Page<TData, TMetadata> | null {
    return this.map.get(key) || null
  }

  remove(keys: TKey[]): void {
    for (const key of keys) {
      this.map.delete(key)
    }
  }

  set(key: TKey, page: Page<TData, TMetadata>): void {
    this.map.set(key, page)
  }

  clear(): void {
    this.map.clear()
  }

  has(keys: TKey[]): [TKey, boolean][] {
    return keys.map(key => {
      return [key, this.map.has(key)]
    })
  }

  entries(): MapIterator<[TKey, Page<TData, TMetadata>]> {
    return this.map.entries()
  }
}

export type InMemoryPageStoreOptions<TKey, TData, TMetadata> = {
  readonly initial?: ValueOrGetter<PagesMap<TKey, TData, TMetadata>>
}

export type ValueOrGetter<T> = T | (() => T)

function toValue<T>(valueOrGetter: ValueOrGetter<T>) {
  return valueOrGetter instanceof Function
    ? valueOrGetter()
    : valueOrGetter
}

export type PagesMap<TKey, TData, TMetadata> = Map<TKey, Page<TData, TMetadata>>
