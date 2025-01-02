import { z } from "zod"

const querySchema = z.object({
  start: z.coerce.number(),
  size: z.coerce.number(),
})

export default defineEventHandler(async (event) => {
  const { start, size } = await getValidatedQuery(event, async query => await querySchema.parseAsync(query))
  return getData(start, size)
})
