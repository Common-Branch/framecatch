import { globalShortcut } from 'electron'
import type { ActionId } from '../shared/types'

type Registration = { accelerator: string; handler: () => void }
type HotkeyChange = { id: ActionId } & Registration
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

// All or nothing: if one hotkey fails, none of them change. Returns the ids that failed.
export function applyHotkeys(changes: HotkeyChange[]): ActionId[] {
    const changing = changes.filter(
        (change) => current.get(change.id)?.accelerator !== change.accelerator
    )
    const newAccelerators = changing.map((change) => change.accelerator)

    // For swaps: we can't register a key we still hold ourselves, so release it first.
    const released: Registration[] = []
    for (const { id } of changing) {
        const old = current.get(id)
        if (
            old &&
            newAccelerators.includes(old.accelerator) &&
            globalShortcut.isRegistered(old.accelerator)
        ) {
            globalShortcut.unregister(old.accelerator)
            released.push(old)
        }
    }

    // Register the new keys before dropping the old ones, so a failure can roll back.
    const registered: string[] = []
    const failed: ActionId[] = []
    for (const { id, accelerator, handler } of changing) {
        if (globalShortcut.register(accelerator, handler)) {
            registered.push(accelerator)
        } else {
            failed.push(id)
        }
    }

    if (failed.length > 0) {
        for (const accelerator of registered) {
            globalShortcut.unregister(accelerator)
        }
        for (const { accelerator, handler } of released) {
            globalShortcut.register(accelerator, handler)
        }
        return failed
    }

    for (const { id, accelerator, handler } of changing) {
        const old = current.get(id)?.accelerator
        if (old && !newAccelerators.includes(old) && globalShortcut.isRegistered(old)) {
            globalShortcut.unregister(old)
        }
        current.set(id, { accelerator, handler })
    }
    return []
}

export function unregisterAction(id: ActionId): void {
    const registration = current.get(id)
    if (registration) {
        globalShortcut.unregister(registration.accelerator)
        current.delete(id)
    }
}

// Keeps `current` as it is, so resume knows what to restore.
export function pauseHotkeys(): void {
    for (const { accelerator } of current.values()) {
        globalShortcut.unregister(accelerator)
    }
}

// A save while paused already registered the new key, so skip it.
export function resumeHotkeys(): void {
    for (const { accelerator, handler } of current.values()) {
        if (!globalShortcut.isRegistered(accelerator)) {
            globalShortcut.register(accelerator, handler)
        }
    }
}
