import { z } from "zod/mini"

const querySchema = z.union([
  z.object({
    page: z.coerce.number(),
    size: z.coerce.number(),
  }),
  z.object({
    afterId: z.optional(
      z.coerce.number()
    ),
    size: z.coerce.number(),
  })
])

export default defineEventHandler(async (event) => {
  const queryParams = await getValidatedQuery(event, async query => await querySchema.parseAsync(query))
  if ("page" in queryParams) {
    return getDataByPage(queryParams.page, queryParams.size)
  } else {
    return getDataFromId(queryParams.afterId, queryParams.size)
  }
})
