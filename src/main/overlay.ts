import { BrowserWindow, Display } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}

export function openOverlay(image: string, activeMonitor: Display): Promise<Rect | null> {
    return new Promise((resolve) => {
        const overlay = new BrowserWindow({
            width: activeMonitor.bounds.width,
            height: activeMonitor.bounds.height,
            x: activeMonitor.bounds.x,
            y: activeMonitor.bounds.y,
            frame: false,
            alwaysOnTop: true,
            hasShadow: false,
            fullscreen: true,
            transparent: true,
            skipTaskbar: true,
            backgroundColor: '#00000000',
            webPreferences: {
                preload: join(__dirname, '../preload/overlay.js'),
                nodeIntegration: false,
                contextIsolation: true
            }
        })

        overlay.webContents.ipc.once('overlay:crop', (_event, rect: Rect) => {
            resolve(rect)
            overlay.close()
        })
        overlay.webContents.ipc.once('overlay:close', () => overlay.close())
        overlay.webContents.ipc.handle('overlay:get-image', () => image)

        overlay.on('closed', () => resolve(null))

        const base = process.env['ELECTRON_RENDERER_URL']
        const url = `${base}/overlay.html`

        if (is.dev && base) {
            overlay.loadURL(url)
        } else {
            overlay.loadFile(join(__dirname, '../renderer/overlay.html'))
        }

        overlay.show()
    })
}
