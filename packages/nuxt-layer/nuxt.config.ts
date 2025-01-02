export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  imports: {
    presets: [
      {
        from: "@unpaged/vue",
        imports: [
          "usePages",
          "usePagingData",
          "usePagingDataSource",
          "usePageLoader",
        ]
      }
    ]
  }
})
