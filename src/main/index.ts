import { app, BrowserWindow, globalShortcut, nativeImage, screen } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { openOverlay } from './overlay'
import { createWindow } from './window'
import { registerAction } from './hotkey'
import { takeFullscreenScreenshot } from './capture'
import { savePng } from './save'

app.disableHardwareAcceleration()

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.commonbranch.framecatch')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // Registering shortcut and what happens when it is pressed
  registerAction('screenshot-full', 'CommandOrControl+Shift+S', async () => {
    try {
      const screenshotBuffer = await takeFullscreenScreenshot()
      const blob = screenshotBuffer.toString('base64')

      openOverlay(blob, async (rect) => {
        const activeMonitor = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
        const scale = activeMonitor.scaleFactor

        const image = nativeImage.createFromBuffer(screenshotBuffer)
        const cropped = image.crop({
          x: Math.round(rect.x * scale),
          y: Math.round(rect.y * scale),
          width: Math.round(rect.width * scale),
          height: Math.round(rect.height * scale)
        })

        const croppedBuffer = cropped.toPNG()
        await savePng(croppedBuffer)
      })

    } catch (e) {
      console.error("Couldn't take and save a screenshot:", e) //logs the error, variable "e" is what comes out
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
