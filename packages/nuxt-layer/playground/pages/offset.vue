<template>

  <div class="flex-grow flex flex-col space-y-4 justify-between">

    <div class="flex-grow">
      <UTable :loading="isPagesPending" :columns="columns" :rows="rows" />
    </div>

    <div class="px-4 flex justify-center gap-4">
      <UButton variant="solid" :loading="isPagesPending" @click="tryRefreshCurrentPage()">Refresh page</UButton>
      <UPagination v-model="currentPage" :page-count="pageSize" :total="total" show-first show-last />
    </div>

  </div>

</template>

<script setup lang="ts">

import { promiseTimeout } from "@vueuse/core"
import { hasData } from "@unpaged/core"

const pageSize = 10

async function loadData(page: number) {
  const query = {
    page,
    size: pageSize
  }
  const data = await $fetch("/api/data", { query })
  // Emulate loading
  await promiseTimeout(1000)
  return data
}

const keys = useState(() => {
  return new Set<number>()
})

const { data: pages, load: loadPage, refresh: refreshPage, invalidate: invalidatePage, pending: isPagesPending } = usePagingData({
  keys,
  async page(key) {
    return await loadData(key)
  },
  metadata(key, page) {
    return { total: page.total }
  }
})

const rows = usePagingDataRows(
  useKeysFilter(pages, (key) => key === currentPage.value),
  data => data.data
)

const columns = usePagingDataColumns(rows)

const currentPage = useState(() => 1)
function tryRefreshCurrentPage() {
  refreshPage(currentPage.value).catch(console.error)
}
const { history: currentPageHistory } = useRefHistory(currentPage, {
  capacity: 5
})
const recentKeys = computed(() => {
  return currentPageHistory.value.map(record => {
    return record.snapshot
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

useOffsetPaging({
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

</script>
