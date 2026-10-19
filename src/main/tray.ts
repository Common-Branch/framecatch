import { app, Menu, nativeImage, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'

let tray: Tray | null = null

export function createTray(onOpen: () => void): void {
    const image = nativeImage.createFromPath(icon).resize({ width: 16, height: 16 })
    tray = new Tray(image)
    tray.setToolTip('Framecatch')
    tray.setContextMenu(
        Menu.buildFromTemplate([
            { label: 'Settings', click: onOpen },
            { label: 'Quit', click: () => app.quit() }
        ])
    )
}
