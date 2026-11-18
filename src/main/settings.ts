import { app } from 'electron'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { Settings } from '../shared/types'
import { settingsSchema } from '../shared/settingsSchema'

function getSettingsPath(): string {
    return join(app.getPath('userData'), 'settings.json')
}

function getDefaults(): Settings {
    return {
        saveFolder: join(app.getPath('pictures'), 'framecatch'),
        screenshotRegionHotkey: 'CommandOrControl+Shift+S',
        screenshotFullHotkey: 'CommandOrControl+Shift+F'
    }
}

let current: Settings | null = null

export async function loadSettings(): Promise<void> {
    try {
        const text = await readFile(getSettingsPath(), 'utf-8')
        // Defaults fill in fields that older versions didn't have. A wrong type resets everything.
        current = settingsSchema.parse({ ...getDefaults(), ...JSON.parse(text) })
    } catch (error) {
        // ENOENT just means first start, no file yet.
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            console.warn('Settings file is invalid, using defaults instead.', error)
        }
        current = getDefaults()
    }
}

export function getSettings(): Settings {
    if (current === null) throw new Error('Settings were not loaded yet')
    return current
}

export async function saveSettings(next: Settings): Promise<void> {
    await mkdir(app.getPath('userData'), { recursive: true })
    await writeFile(getSettingsPath(), JSON.stringify(next, null, 2))
    current = next
}
