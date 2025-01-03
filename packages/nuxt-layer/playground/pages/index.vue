<template>
  <UContainer class="min-h-screen flex flex-col py-8 gap-4">
    <div class="flex-grow">
      <UTable :loading="pending" :columns="columns" :rows="rows" />
    </div>

    <div class="px-4 flex justify-center">
      <UPagination v-model="currentPage" :page-count="pageSize" :total="total" show-first show-last />
    </div>

  </UContainer>

</template>

<script setup lang="ts">

import { promiseTimeout } from "@vueuse/core"
import { hasData } from "@unpaged/core"

const pageSize = 10

async function loadData(page: number) {
  await promiseTimeout(1000)
  const query = {
    start: (page - 1) * pageSize,
    size: pageSize
  }
  const data = await $fetch("/api/data", { query })
  return data
}

const keys = useState(() => {
  return new Set<number>()
})

const { data: pages, load: loadPage, invalidate: invalidatePage, pending } = usePagingData({
  keys,
  async load(key) {
    return await loadData(key)
  },
  metadata(key, page) {
    return { total: page.total }
  }
})

const pagedData = computed(() => {
  return [...pages.value.entries()]
})

function keyToLabel(value: string) {
  if (value === "id") {
    return value.toUpperCase()
  }
  return value.replace("_", " ")
}

const columns = computed(() => {
  const columns: Map<string, string> = new Map()

  for (const row of rows.value) {
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

const currentPage = useState(() => 1)
const { history: currentPageHistory } = useRefHistory(currentPage, {
  capacity: 5
})
const recentKeys = computed(() => {
  return currentPageHistory.value.map(record => {
    return record.snapshot
  })
})

const currentPagePagedData = computed(() => {
  return pagedData.value.filter(([key]) => {
    return key === currentPage.value
  })
})

const rows = computed(() => {
  const pagedDataValue = currentPagePagedData.value
  // const pagedDataValue = pagedData.value
  return pagedDataValue.flatMap(([key, page]) => {
    return hasData(page) ? page.data.data.map(dataItem => {
      return {
        "page_key": key,
        ...dataItem,
      }
    }) : []
  })
})

const total = computed(() => {
  let total = currentPage.value * pageSize * 2
  const page = [...pages.value.values()].at(0)
  if (page && hasData(page) && page.metadata) {
    total = page.metadata.total
  }
  return total
})

onMounted(async () => {
  usePageLoader({
    page: currentPage,
    data: pages,
    load: loadPage,
    invalidate: invalidatePage,
    preload(key) {
      const recentKeysValue = recentKeys.value
      let additionalKeys: number[] = []
      if (key > 1) {
        additionalKeys = [key - 1, key + 1]
      }
      if (key > 0) {
        additionalKeys = [key + 1]
      }
      const allUniqueKeys = new Set([...recentKeysValue, ...additionalKeys])
      return [...allUniqueKeys.values()]
    },
    unload(key, currentKey) {
      return Math.abs(key - currentKey) > 1
    }
  })
})

</script>
