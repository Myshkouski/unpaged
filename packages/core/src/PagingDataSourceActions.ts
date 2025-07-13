export interface PagingDataSourceActions<TKey, TData, TMetadata> {
  load(keys: TKey[]): Promise<void>
  refresh(keys: TKey[]): Promise<void>
  invalidate(keys: TKey[]): void
  loadData(key: TKey): Promise<TData>
  getPageMetadata(key: TKey, data: TData): TMetadata
}
