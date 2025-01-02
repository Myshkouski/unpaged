import { usePagingDataSourceState } from "./internal/usePagingDataSourceState"
import { usePagingDataSource as _usePagingDataSource, type UsePagingDataSourceOptions } from "./internal/usePagingDataSource"

export function usePagingDataSource<TKey, TData, TMetadata>(options: UsePagingDataSourceOptions<TKey, TData, TMetadata>) {
  const state = usePagingDataSourceState<TKey, TData, TMetadata>()
  return _usePagingDataSource<TKey, TData, TMetadata>(state, options)
}
