import type { PagingDataSourceState } from "./PagingDataSourceState"
import type { PagingDataSourceActions } from "./PagingDataSourceActions"

export interface PagingDataSource<TKey, TData, TMetadata>
extends PagingDataSourceActions<TKey, TData, TMetadata>,
        PagingDataSourceState<TKey, TData, TMetadata> {}
