import type { ActionId, Settings } from '../shared/types'

export interface OverlayApi {
    crop(rect: { x: number; y: number; width: number; height: number }): void
    close(): void
    getImage(): Promise<string>
}

export interface SettingsApi {
    getSettings(): Promise<Settings>
    // Returns the hotkeys that failed to register. An empty array means it was saved.
    saveSettings(next: Settings): Promise<ActionId[]>
    chooseFolder(): Promise<string | null>
    pauseHotkeys(): void
    resumeHotkeys(): void
}

declare global {
    interface Window {
        overlayApi: OverlayApi
        settingsApi: SettingsApi
    }
}
