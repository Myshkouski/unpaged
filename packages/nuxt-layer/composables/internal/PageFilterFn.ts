import type { Page } from "@unpaged/core"

export type PageFilterFn<T> = (index: number, page: Page<T>) => boolean
