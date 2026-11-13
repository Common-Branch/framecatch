import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { resumeHotkeys } from './hotkey'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

app.on('before-quit', () => {
    isQuitting = true
})

export function createWindow(): void {
    const win = new BrowserWindow({
        icon: icon,
        width: 1280,
        height: 720,
        show: false,
        webPreferences: { preload: join(__dirname, '../preload/index.js') }
    })

    win.removeMenu()
    mainWindow = win

    win.on('ready-to-show', () => win.show())

    // The renderer may never send 'hotkeys:resume' if the window loses focus, reloads or crashes.
    win.on('blur', resumeHotkeys)
    win.webContents.on('did-start-loading', resumeHotkeys)
    win.webContents.on('render-process-gone', resumeHotkeys)

    win.on('close', (event) => {
        if (isQuitting) return
        event.preventDefault()
        win.hide()
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

export function showMainWindow(): void {
    if (mainWindow === null) {
        createWindow()
    } else {
        mainWindow.show()
        mainWindow.focus()
    }
}
