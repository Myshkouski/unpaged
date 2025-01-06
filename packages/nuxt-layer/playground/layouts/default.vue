<template>

  <UContainer class="min-h-screen flex flex-col py-8 gap-4">

    <header>
      <div class="flex justify-center">
        <UTabs :items="items" v-model="selectedItemIndex" />
      </div>
    </header>

    <main class="flex-grow flex flex-col">
      <slot />
    </main>

  </UContainer>

</template>

<script setup lang="ts">

import type { TabItem } from '#ui/types'

const items = [
  {
    label: 'Offset',
    icon: 'material-symbols:format-list-numbered',
    routePath: "/offset",
  },
  {
    label: 'Cursor',
    icon: 'mdi:infinity',
    routePath: "/cursor",
  },
] satisfies TabItem[]

function useSelectedItem() {
  const route = useRoute()
  let value = 0
  switch (route.path) {
    case items[0]!.routePath:
      value = 0
      break
    case items[1]!.routePath:
      value = 1
      break
  }
  return ref<number>(value)
}

const selectedItemIndex = useSelectedItem()

watch(selectedItemIndex, async selectedItemIndex => {
  const path = items.at(selectedItemIndex)?.routePath
  if (!path) return
  await navigateTo({ path })
})

</script>
