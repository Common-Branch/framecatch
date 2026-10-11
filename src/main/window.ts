import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
