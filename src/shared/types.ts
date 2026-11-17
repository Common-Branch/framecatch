import type { z } from 'zod'
import type { settingsSchema } from './settingsSchema'

export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'

// Built from the schema, so the type and the check can never disagree.
export type Settings = z.infer<typeof settingsSchema>
