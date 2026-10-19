export interface OverlayApi {
    crop(rect: { x: number; y: number; width: number; height: number }): void
    close(): void
    getImage(): Promise<string>
}

export interface SettingsApi {
    getSettings(): Promise<Settings>
    saveSettings(): Promise<void>
    chooseFolder(): Promise<string | null>
}

declare global {
    interface Window {
        overlayApi: OverlayApi
        settingsApi: SettingsApi
    }
}
