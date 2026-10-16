import { contextBridge, ipcRenderer } from 'electron'
import type { Settings } from '../shared/types'

contextBridge.exposeInMainWorld('settingsApi', {
    getSettings: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    saveSettings: (next: Settings): Promise<void> => ipcRenderer.invoke('settings:save', next),
    chooseFolder: (): Promise<string | null> => ipcRenderer.invoke('settings:choose-folder')
})
