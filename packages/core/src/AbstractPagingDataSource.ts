import type { Page } from "./Page"
import type { PagesMap } from "./PagesMap"
import type { PagingDataSource } from "./PagingDataSource"

export abstract class AbstractPagingDataSource<TKey, TData, TMetadata>
implements PagingDataSource<TKey, TData, TMetadata> {
  abstract get isPending(): boolean
  abstract set isPending(value)

  abstract get pages(): PagesMap<TKey, TData, TMetadata>
  abstract set pages(value)

  private promise: Promise<PagesMap<TKey, TData, TMetadata>> = Promise.resolve(new Map())

  abstract loadPage(key: TKey): Promise<TData>
  abstract getPageMetadata(key: TKey, data: TData): TMetadata

  private async tryLoadData(key: TKey): Promise<[TKey, Page<TData, TMetadata>]> {
    let page: Page<TData, TMetadata>

    try {
      const data = await this.loadPage(key)
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

  private async tryLoad(keys: TKey[], skipCache: boolean = false) {
    await this.promise

    this.isPending = true

    try {
      const promises = keys.map(key => {
        return Promise.resolve(
          true === skipCache ? this.tryLoadData(key) : this.tryGetCachedOrLoad(key)
        )
      })

      this.promise = Promise.all(promises).then(entries => new Map(entries))

      this.pages = await this.promise
    } catch (e) {
      //
    }

    this.isPending = false
  }

  async load(keys: TKey[]): Promise<void> {
    await this.tryLoad(keys)
  }

  async refresh(keys: TKey[]): Promise<void> {
    await this.tryLoad(keys, true)
  }
}
