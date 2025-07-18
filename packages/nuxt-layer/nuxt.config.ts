export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  imports: {
    presets: [
      {
        from: "@unpaged/vue",
        imports: [
          "usePagingData",
          "usePagingMeta",
          "usePagingDataSource",
          "useOffsetPaging",
        ]
      }
    ]
  }
})
