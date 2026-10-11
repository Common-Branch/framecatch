import { app, BrowserWindow, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import { createWindow } from './window'
import { registerAction } from './hotkey'
import { takeFullscreenScreenshot } from './capture'
import { savePng } from './save'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.commonbranch.framecatch')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // Registering shortcut and what happens when it is pressed
  registerAction('screenshot-full', 'CommandOrControl+Shift+S', async () => {
    try {
      await savePng(await takeFullscreenScreenshot())
    } catch {
      console.error("Couldn't take and save a screenshot")
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => globalShortcut.unregisterAll())

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
