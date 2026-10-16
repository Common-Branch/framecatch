import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('overlayApi', {
    crop: (rect: { x: number; y: number; width: number; height: number }): void =>
        ipcRenderer.send('overlay:crop', rect),
    close: (): void => ipcRenderer.send('overlay:close'),
    getImage: (): Promise<string> => ipcRenderer.invoke('overlay:get-image')
})
