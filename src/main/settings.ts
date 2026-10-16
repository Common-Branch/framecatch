import { app } from 'electron'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { Settings } from '../shared/types'

function getSettingsPath(): string {
    return join(app.getPath('userData'), 'settings.json')
}

function getDefaults(): Settings {
    return { saveFolder: join(app.getPath('pictures'), 'framecatch') }
}

let current: Settings | null = null

export async function loadSettings(): Promise<void> {
    try {
        const text = await readFile(getSettingsPath(), 'utf-8')
        current = { ...getDefaults(), ...JSON.parse(text) }
    } catch {
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
