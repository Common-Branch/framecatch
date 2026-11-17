import type { z } from 'zod'
import type { settingsSchema } from './settingsSchema'

export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'

// From the schema, so the type and the runtime check can't drift apart.
export type Settings = z.infer<typeof settingsSchema>
