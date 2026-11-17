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
        // Missing fields come from the defaults, so a file from an older version keeps its values.
        // A field with the wrong type makes parse throw, and the whole file is ignored.
        current = settingsSchema.parse({ ...getDefaults(), ...JSON.parse(text) })
    } catch (error) {
        // No file yet is normal on the first start. Anything else means the file is broken.
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
