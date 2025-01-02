import type { ToRefs } from "vue";
import type { PagingDataSourceActions } from "@unpaged/core/src/PagingDataSourceActions";
import type { PagesMap } from "@unpaged/core/src/PagesMap";
import type { PagingDataSourceState } from "@unpaged/core/src/PagingDataSourceState";
import { AbstractPagingDataSource } from "@unpaged/core/src/AbstractPagingDataSource";

export class VuePagingDataSource<TKey, TData, TMetadata>
extends AbstractPagingDataSource<TKey, TData, TMetadata> {
  constructor(
    private readonly options: VuePagingDataSourceOptions<TKey, TData, TMetadata>
  ) {
    super()
  }

  override get isPending(): boolean {
    return this.options.isPending.value
  }
  override set isPending(value: boolean) {
    this.options.isPending.value = value
  }

  override get pages(): PagesMap<TKey, TData, TMetadata> {
    return this.options.pages.value
  }
  override set pages(value: PagesMap<TKey, TData, TMetadata>) {
    this.options.pages.value = value
  }

  override async load(key: TKey): Promise<TData> {
    return await this.options.load(key)
  }

  override getPageMetadata(key: TKey, data: TData): TMetadata {
    return this.options.getPageMetadata(key, data)
  }
}

export type VuePagingDataSourceActions<TKey, TData, TMetadata> = Omit<PagingDataSourceActions<TKey, TData, TMetadata>, "refresh" >

export type VuePagingDataSourceOptions<TKey, TData, TMetadata> =
  VuePagingDataSourceActions<TKey, TData, TMetadata> &
  ToRefs<PagingDataSourceState<TKey, TData, TMetadata>>
