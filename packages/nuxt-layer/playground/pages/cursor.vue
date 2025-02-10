<template>

  <div class="flex-grow flex flex-col space-y-4 justify-between">

    <div class="flex-grow">
      <UTable :loading="isPagesPending" :columns="columns" :rows="rows" />
    </div>

    <!-- <div v-intersection-observer="onTfootIntersectionObserver" /> -->

    <div class="px-4 flex justify-center gap-4">
      <UButton variant="solid" :loading="isPagesPending" @click="onLoadMoreClick()">Load more</UButton>
      <UButton variant="solid" :loading="isPagesPending" @click="onRefreshClick()">Refresh</UButton>
    </div>

    <div class="fixed bottom-8 right-4">
      <UButton square @click="onBackToTopClick()">
        <UIcon name="mdi:arrow-up" class="w-6 h-6" />
      </UButton>
    </div>

  </div>

</template>

<script setup lang="ts">

import { promiseTimeout } from "@vueuse/core"

const pageSize = 10

async function loadData(id: number | null) {
  await promiseTimeout(1000)
  const query = {
    id: id || undefined,
    size: pageSize
  }
  const data = await $fetch("/api/data", { query })
  return data
}

const initialKeys = [null]

const keys = useState(() => {
  return new Set<number | null>(initialKeys)
})

const {
  data: pages,
  load: loadPage,
  refresh: refreshPage,
  invalidate: invalidatePage,
  pending: isPagesPending,
} = usePagingData({
  keys,
  async page(key) {
    return await loadData(key)
  },
  metadata(key, page) {
    return {
      pageSize: page.data.length,
      lastItemId: page.data.at(-1)?.id,
    }
  }
})

const rows = usePagingDataRows(
  pages,
  data => data.data
)

const columns = usePagingDataColumns(rows)

// type UsePageLoaderOptions<K, T, M> = Pick<ReturnType<typeof usePagingData<K, T, M>>, "data" | "load" | "invalidate">

const isIntersecting = ref<boolean>()

import { vIntersectionObserver } from '@vueuse/components'

const pagesMetadata = usePagingMetadata(pages)

async function tryLoadNextPage() {
  const lastItemMetadataEntry = [...pagesMetadata.value.entries()].at(-1)
  if (lastItemMetadataEntry) {
    const [key, metadata] = lastItemMetadataEntry
    console.debug(metadata)
    if (metadata) {
      if (10 > metadata.pageSize) {
        await refreshPage(key)
      } else if (metadata.lastItemId) {
        await loadPage(metadata.lastItemId)
      }
    }
  }
}

const throttledTryLoadNextPage = useThrottleFn(async () => {
  await tryLoadNextPage()
}, 5000, false, true)

function onTfootIntersectionObserver(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      isIntersecting.value = true
      throttledTryLoadNextPage()
      break
    }
  }

  isIntersecting.value = false
}

watchImmediate([isIntersecting, isPagesPending], async ([isIntersecting, pending]) => {
  if (isIntersecting && !pending) {
    await throttledTryLoadNextPage()
  }
})

function onLoadMoreClick() {
  tryLoadNextPage().catch(console.error)
}

const windowScroll = useWindowScroll({ behavior: "smooth" })

function onBackToTopClick() {
  windowScroll.y.value = 0
}

async function invalidateAllAndRefresh() {
  invalidatePage(...keys.value)

  keys.value = new Set(initialKeys)
  await refreshPage(...keys.value)
}

function onRefreshClick() {
  // invalidateAllAndRefresh().catch(console.error)
  refreshPage(...keys.value).catch(console.error)
}

</script>
