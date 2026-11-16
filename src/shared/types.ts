export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'

export interface Settings {
    saveFolder: string
    screenshotRegionHotkey: string
    screenshotFullHotkey: string
}
