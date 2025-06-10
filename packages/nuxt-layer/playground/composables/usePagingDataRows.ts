import { type PagesMap, hasData } from "@unpaged/core"

export function usePagingDataRows<T, U, V, W>(
  data: MaybeRefOrGetter<PagesMap<T, U, V>>,
  transform: (items: U) => W[]
) {
  return computed(() => {
    const pagedDataValue = [...toValue(data).entries()]
    return pagedDataValue.flatMap(([key, page]) => {
      return hasData(page) ? transform(page.data).map(dataItem => {
        return {
          "page_key": key + "",
          ...dataItem,
        }
      }) : []
    })
  })
}

export function usePagingDataColumns<T extends Record<string, unknown>>(data: MaybeRefOrGetter<T[]>) {
  return computed(() => {
    const columns: Map<string, string> = new Map()

    for (const row of toValue(data)) {
      Object.keys(row).forEach(key => {
        const label = keyToLabel(key)
        columns.set(key, label)
      })
    }

    const namedColumns = columns.entries().map(([key, label]) => {
      return { key, label }
    }).toArray()

    return [
      ...namedColumns,
      {
        key: 'actions'
      }
    ]
  })
}

function keyToLabel(value: string) {
  if (value === "id") {
    return value.toUpperCase()
  }
  return value.replace("_", " ")
}
