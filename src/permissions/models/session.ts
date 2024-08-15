import { z } from 'zod'

export const sessionSchema = z.object({
  __typename: z.literal('Session').default('Session'),
  id: z.string(),
})

export type Plan = z.infer<typeof sessionSchema>