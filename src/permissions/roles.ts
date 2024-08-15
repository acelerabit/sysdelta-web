import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('PRESIDENT'),
  z.literal('COUNCILOR'),
  z.literal('SECRETARY'),
  z.literal('ASSISTANT'),
])

export type Role = z.infer<typeof roleSchema>