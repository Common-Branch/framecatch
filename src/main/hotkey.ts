import { globalShortcut } from 'electron'

export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'
const current = new Map<ActionId, string>()

export function registerAction(id: ActionId, accelerator: string, handler: () => void): boolean {
    const old = current.get(id)
    if (old === accelerator) return true

    const ok = globalShortcut.register(accelerator, handler)
    if (!ok) return false

    if (old) globalShortcut.unregister(old)
    current.set(id, accelerator)
    return true
}

export function unregisterAction(id: ActionId): void {
    const accelerator = current.get(id)
    if (accelerator) {
        globalShortcut.unregister(accelerator)
        current.delete(id)
    }
}
