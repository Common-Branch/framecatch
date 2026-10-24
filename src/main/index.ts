import { app, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow, showMainWindow } from './window'
import { registerAction } from './hotkey'
import { captureFullscreen, captureRegion } from './actions'
import { createTray } from './tray'
import { loadSettings } from './settings'
import { registerIpc } from './ipc'

app.whenReady().then(async () => {
    await loadSettings()

    registerIpc()

    electronApp.setAppUserModelId('com.commonbranch.framecatch')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    // TODO - Settings
    createTray(showMainWindow)

    registerAction('screenshot-region', 'CommandOrControl+Shift+S', captureRegion)
    registerAction('screenshot-full', 'CommandOrControl+Shift+F', captureFullscreen)

    app.on('activate', () => {
        showMainWindow()
    })
})

app.on('will-quit', () => globalShortcut.unregisterAll())
