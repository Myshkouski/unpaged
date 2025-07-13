import type { Page } from "./Page"
import type { PagesMap } from "./PagesMap"
import type { PagingDataSource } from "./PagingDataSource"

export abstract class AbstractPagingDataSource<TKey, TData, TMetadata>
implements PagingDataSource<TKey, TData, TMetadata> {
  abstract get isPending(): boolean
  abstract set isPending(value)

  abstract get pages(): PagesMap<TKey, TData, TMetadata>
  abstract set pages(value)

  private promise: Promise<[TKey, Page<TData, TMetadata>][]> = Promise.resolve([])

  abstract loadData(key: TKey): Promise<TData>
  abstract getPageMetadata(key: TKey, data: TData): TMetadata

  private async tryLoadData(key: TKey): Promise<[TKey, Page<TData, TMetadata>]> {
    let page: Page<TData, TMetadata>

    try {
      const data = await this.loadData(key)
      const metadata = this.getPageMetadata(key, data)
      page = { data, metadata }
    } catch (e) {
      page = { error: e }
    }

    return [key, page]
  }

  private tryGetCached(key: TKey): [TKey, Page<TData, TMetadata>] | undefined {
    if (this.pages.has(key)) {
      return [key, this.pages.get(key) as Page<TData, TMetadata>]
    }
  }

  private async tryGetCachedOrLoad(key: TKey): Promise<[TKey, Page<TData, TMetadata>]> {
    let page = this.tryGetCached(key)
    if (!page) {
      page = await this.tryLoadData(key)
    }
    return page
  }

  private async tryLoad(keys: TKey[], options: { skipCache: boolean, clearState: boolean }) {
    await this.promise

    this.isPending = true

    try {
      const promises = keys.map(key => {
        return true === options.skipCache
          ? this.tryLoadData(key)
          : this.tryGetCachedOrLoad(key)
      })

      this.promise = Promise.all(promises)

      const newEntries = await this.promise

      if (options.clearState) {
        this.pages.clear()
      }
      
      for (const [key, page] of newEntries) {
        this.pages.set(key, page)
      }
    } catch (e) {
      //
    }

    this.isPending = false
  }

  async load(keys: TKey[]): Promise<void> {
    await this.tryLoad(keys, {
      skipCache: false,
      clearState: true
    })
  }

  async refresh(keys: TKey[]): Promise<void> {
    const loadedKeys = keys.filter(key => {
      return this.pages.has(key)
    })
    await this.tryLoad(loadedKeys, {
      skipCache: true,
      clearState: false
    })
  }

  invalidate(keys: TKey[]) {
    for (const key of keys) {
      this.pages.delete(key)
    }
  }
}
