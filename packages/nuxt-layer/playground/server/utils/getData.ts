import mockData from "~/assets/data.json"

export type Data = ArrayElement<typeof mockData>
export type DataSlice<T> = {
  data: T
  total: number
}

function getDataSlice(start: number, size: number): DataSlice<Data[]> {
  const data = mockData.slice(start, start + size)

  return {
    data,
    total: mockData.length
  }
}

export function getDataByPage(page: number, pageSize: number): DataSlice<Data[]> {
  const start = page > 1
    ? (page - 1) * pageSize
    : 0
  return getDataSlice(start, pageSize)
}

export function getDataFromId(afterId: number | null | undefined, size: number): DataSlice<Data[]> {
  const start = afterId && (afterId > 0)
    ? Math.max(
        1 + mockData.findIndex(data => {
          return data.id === afterId
        }),
        0
      )
    : 0

  return getDataSlice(start, size)
}
