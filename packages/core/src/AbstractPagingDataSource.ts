import type { Page } from "./Page"
import type { PageStore } from "./PageStore"
import type { PagingDataSource } from "./PagingDataSource"

export abstract class AbstractPagingDataSource<TKey, TData, TMetadata>
implements PagingDataSource<TKey, TData, TMetadata> {
  abstract get isPending(): boolean
  abstract set isPending(value)

  protected abstract readonly pageStore: PageStore<TKey, TData, TMetadata> 

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

  private async tryGetCached(key: TKey): Promise<[TKey, Page<TData, TMetadata>] | undefined> {
    const page = await this.pageStore.find(key)
    if (page) {
      return [key, page]
    }
  }

  private async tryGetCachedOrLoad(key: TKey): Promise<[TKey, Page<TData, TMetadata>]> {
    let page = await this.tryGetCached(key)
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
        await this.pageStore.clear()
      }
      
      for (const [key, page] of newEntries) {
        await this.pageStore.set(key, page)
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
    const hasPages = await this.pageStore.has(keys)
    const loadedKeys = hasPages.filter(([key, loaded]) => {
      return loaded
    }).map(([key]) => {
      return key
    })
    await this.tryLoad(loadedKeys, {
      skipCache: true,
      clearState: false
    })
  }

  async invalidate(keys: TKey[]) {
    await this.pageStore.remove(keys)
  }
}
