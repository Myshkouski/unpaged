import type { Page } from "./Page";

export interface PageStore<
  TKey, 
  TData, 
  TMetadata, 
  TPage extends Page<TData, TMetadata> = Page<TData, TMetadata>
> {
  find(key: TKey): MaybePromise<TPage | null>;
  remove(keys: TKey[]): MaybePromise<void>;
  set(key: TKey, page: TPage): MaybePromise<void>;
  clear(): MaybePromise<void>;
  has(keys: TKey[]): MaybePromise<[TKey, boolean][]>;
  entries(): MaybePromise<AsyncIterator<[TKey, TPage]> | MapIterator<[TKey, TPage]>>;
}

export type MaybePromise<T> = Promise<T> | T
