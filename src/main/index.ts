import { app, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow, showMainWindow } from './window'
import { createTray } from './tray'
import { getSettings, loadSettings } from './settings'
import { registerIpc } from './ipc'
import { registerAction } from './hotkey'
import { captureRegion, captureFullscreen } from './actions'

app.whenReady().then(async () => {
    await loadSettings()

    registerIpc()

    electronApp.setAppUserModelId('com.commonbranch.framecatch')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()
    createTray(showMainWindow)

    const currentSettings = getSettings()
    registerAction('screenshot-region', currentSettings.screenshotRegionHotkey, captureRegion)
    registerAction('screenshot-full', currentSettings.screenshotFullHotkey, captureFullscreen)

    app.on('activate', () => {
        showMainWindow()
    })
})

app.on('will-quit', () => globalShortcut.unregisterAll())
