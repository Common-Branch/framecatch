import { globalShortcut, dialog } from 'electron'

export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'
const current = new Map<ActionId, string>()

export function registerAction(id: ActionId, accelerator: string, handler: () => void): boolean {
    const old = current.get(id)
    if (old && old !== accelerator) globalShortcut.unregister(old)

    const ok = globalShortcut.register(accelerator, handler)
    if (ok) {
        current.set(id, accelerator)
    } else {
        dialog.showErrorBox(
            'Shortcut unavailable',
            `${accelerator} is already used by another app.`
        )
    }

    return ok
}

export function unregisterAction(id: ActionId): void {
    const accelerator = current.get(id)
    if (accelerator) {
        globalShortcut.unregister(accelerator)
        current.delete(id)
    }
}
