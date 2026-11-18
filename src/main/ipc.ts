import { dialog, ipcMain } from 'electron'
import { settingsSchema } from '../shared/settingsSchema'
import { getSettings, saveSettings } from './settings'
import { applyHotkeys, pauseHotkeys, resumeHotkeys } from './hotkey'
import { captureRegion, captureFullscreen } from './actions'

export function registerIpc(): void {
    ipcMain.handle('settings:get', () => getSettings())

    ipcMain.handle('settings:save', async (_event, input: unknown) => {
        const next = settingsSchema.parse(input)
        // TODO: compare every pair once there are more than two hotkeys.
        if (next.screenshotRegionHotkey === next.screenshotFullHotkey) {
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
            await saveSettings(next)
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
