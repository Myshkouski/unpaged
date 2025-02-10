import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number(),
  size: z.coerce.number(),
}).or(
  z.object({
    id: z.coerce.number().optional(),
    size: z.coerce.number(),
  })
)

export default defineEventHandler(async (event) => {
  const queryParams = await getValidatedQuery(event, async query => await querySchema.parseAsync(query))
  if ("page" in queryParams) {
    return getDataByPage(queryParams.page, queryParams.size)
  } else {
    return getDataFromId(queryParams.id, queryParams.size)
  }
})
