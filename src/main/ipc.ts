import { dialog, ipcMain } from 'electron'
import type { Settings } from '../shared/types'
import { getSettings, saveSettings } from './settings'

export function registerIpc(): void {
    ipcMain.handle('settings:get', () => getSettings())

    ipcMain.handle('settings:save', async (_event, next: Settings) => {
        if (typeof next !== 'object' || next === null || typeof next.saveFolder !== 'string') {
            throw new Error('Invalid settings')
        }
        await saveSettings({ saveFolder: next.saveFolder })
    })

    ipcMain.handle('settings:choose-folder', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory']
        })
        return result.canceled ? null : result.filePaths[0]
    })
}
