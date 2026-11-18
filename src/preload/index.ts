import { contextBridge, ipcRenderer } from 'electron'
import type { ActionId, Settings } from '../shared/types'

contextBridge.exposeInMainWorld('settingsApi', {
    getSettings: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    saveSettings: (next: Settings): Promise<ActionId[]> =>
        ipcRenderer.invoke('settings:save', next),
    chooseFolder: (): Promise<string | null> => ipcRenderer.invoke('settings:choose-folder'),
    pauseHotkeys: (): void => ipcRenderer.send('hotkeys:pause'),
    resumeHotkeys: (): void => ipcRenderer.send('hotkeys:resume')
})
