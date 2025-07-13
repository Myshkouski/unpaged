import { shallowReactive, type ToRefs } from "vue"
import type { PagingDataSourceActions } from "@unpaged/core"
import type { PagingDataSourceState } from "@unpaged/core"
import { AbstractPagingDataSource, InMemoryPageStore } from "@unpaged/core"

export class VuePagingDataSource<TKey, TData, TMetadata>
extends AbstractPagingDataSource<TKey, TData, TMetadata> {
  protected readonly pageStore = new InMemoryPageStore<TKey, TData, TMetadata>({
    initial: shallowReactive(new Map())
  })

  constructor(
    private readonly options: VuePagingDataSourceOptions<TKey, TData, TMetadata>
  ) {
    super()
  }

  get pages() {
    return new Map(
      this.pageStore.entries()
    )
  }

  override get isPending(): boolean {
    return this.options.isPending.value
  }
  override set isPending(value: boolean) {
    this.options.isPending.value = value
  }

  async loadData(key: TKey): Promise<TData> {
    return await this.options.loadData(key)
  }

  override getPageMetadata(key: TKey, data: TData): TMetadata {
    return this.options.getPageMetadata(key, data)
  }
}

export type VuePagingDataSourceActions<TKey, TData, TMetadata> = Omit<PagingDataSourceActions<TKey, TData, TMetadata>, "load" | "refresh" | "invalidate" >

export type VuePagingDataSourceOptions<TKey, TData, TMetadata> =
  VuePagingDataSourceActions<TKey, TData, TMetadata> &
  ToRefs<PagingDataSourceState<TKey, TData, TMetadata>>
