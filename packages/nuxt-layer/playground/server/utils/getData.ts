import mockData from "~/assets/data.json"

export type Data = ArrayElement<typeof mockData>
export type DataSlice<T> = {
  data: T
  total: number
}

export function getData(start: number, size: number): DataSlice<Data[]> {
  const data = mockData.slice(start, start + size)

  return {
    data,
    total: mockData.length
  }
}
