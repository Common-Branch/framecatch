import { globalShortcut } from 'electron'

export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'
type Registration = { accelerator: string; handler: () => void }
const current = new Map<ActionId, Registration>()

export function registerAction(id: ActionId, accelerator: string, handler: () => void): boolean {
    const old = current.get(id)?.accelerator
    if (old === accelerator) return true

    const ok = globalShortcut.register(accelerator, handler)
    if (!ok) return false

    if (old) globalShortcut.unregister(old)
    current.set(id, { accelerator, handler })
    return true
}

export function unregisterAction(id: ActionId): void {
    const registration = current.get(id)
    if (registration) {
        globalShortcut.unregister(registration.accelerator)
        current.delete(id)
    }
}

// Pausing only unregisters from the OS. `current` keeps the list, so resume knows what to restore.
export function pauseHotkeys(): void {
    for (const { accelerator } of current.values()) {
        globalShortcut.unregister(accelerator)
    }
}

// Saving while paused registers the changed hotkey already, so skip anything that is registered.
export function resumeHotkeys(): void {
    for (const { accelerator, handler } of current.values()) {
        if (!globalShortcut.isRegistered(accelerator)) {
            globalShortcut.register(accelerator, handler)
        }
    }
}
