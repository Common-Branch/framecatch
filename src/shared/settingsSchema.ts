import { z } from 'zod'

// The one description of what valid settings look like. Main uses it to check
// the settings file and every save request from the settings window.
export const settingsSchema = z.object({
    saveFolder: z.string(),
    screenshotRegionHotkey: z.string(),
    screenshotFullHotkey: z.string()
})
