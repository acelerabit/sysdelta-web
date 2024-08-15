import { z } from 'zod'
import { sessionSchema } from '../models/session'

export const sessionSubject = z.tuple(
  [
    z.union([
      z.literal('manage'),
      z.literal('get'),
      z.literal('list'),
      z.literal('create'),
      z.literal('update'),
      z.literal('delete'),
    ]),
    z.union([z.literal('Session'), sessionSchema])
  ]
)

export type SessionSubject = z.infer<typeof sessionSubject>