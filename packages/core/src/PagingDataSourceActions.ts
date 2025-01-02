export interface PagingDataSourceActions<TKey, TData, TMetadata> {
  load(key: TKey): Promise<TData>
  refresh(keys: TKey[]): Promise<void>
  getPageMetadata(key: TKey, data: TData): TMetadata
}
