import type { Page } from "@unpaged/core/src/Page";

export type PageFilterFn<T> = (index: number, page: Page<T>) => boolean;
