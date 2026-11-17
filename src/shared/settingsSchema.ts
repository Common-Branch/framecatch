import { z } from 'zod'

export const settingsSchema = z.object({
    saveFolder: z.string(),
    screenshotRegionHotkey: z.string(),
    screenshotFullHotkey: z.string()
})
