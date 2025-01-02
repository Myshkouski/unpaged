export interface LoadResult {}

export interface SuccessLoadResult<TData, TMetadata> {
  data: TData
  metadata?: TMetadata
}

export interface FailedLoadResult<TError = unknown> {
  error?: TError
}

export type Page<TData, TMetadata = unknown> = SuccessLoadResult<TData, TMetadata> | FailedLoadResult

export function hasData<TData, TMetadata>(page: LoadResult): page is SuccessLoadResult<TData, TMetadata> {
  return "data" in page
}

export function hasError<TData, TMetadata>(page: LoadResult): page is FailedLoadResult {
  return "error" in page
}
