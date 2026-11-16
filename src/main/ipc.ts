import { dialog, ipcMain } from 'electron'
import type { Settings } from '../shared/types'
import { getSettings, saveSettings } from './settings'
import { applyHotkeys, pauseHotkeys, resumeHotkeys } from './hotkey'
import { captureRegion, captureFullscreen } from './actions'

export function registerIpc(): void {
    ipcMain.handle('settings:get', () => getSettings())

    ipcMain.handle('settings:save', async (_event, next: Settings) => {
        if (
            typeof next !== 'object' ||
            next === null ||
            typeof next.saveFolder !== 'string' ||
            typeof next.screenshotRegionHotkey !== 'string' ||
            typeof next.screenshotFullHotkey !== 'string' ||
            // Add check for multiple hotkeys not having the same value when there will be more hotkeys added
            next.screenshotRegionHotkey === next.screenshotFullHotkey
        ) {
            throw new Error('Invalid settings')
        }

        const failed = applyHotkeys([
            {
                id: 'screenshot-region',
                accelerator: next.screenshotRegionHotkey,
                handler: captureRegion
            },
            {
                id: 'screenshot-full',
                accelerator: next.screenshotFullHotkey,
                handler: captureFullscreen
            }
        ])

        if (failed.length === 0) {
            await saveSettings({
                saveFolder: next.saveFolder,
                screenshotRegionHotkey: next.screenshotRegionHotkey,
                screenshotFullHotkey: next.screenshotFullHotkey
            })
        }
        return failed
    })

    ipcMain.on('hotkeys:pause', () => pauseHotkeys())
    ipcMain.on('hotkeys:resume', () => resumeHotkeys())

    ipcMain.handle('settings:choose-folder', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory']
        })
        return result.canceled ? null : result.filePaths[0]
    })
}
