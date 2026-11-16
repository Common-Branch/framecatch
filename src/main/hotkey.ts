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

// All or nothing: either every change is applied, or everything stays as it was.
// Returns the ids that failed to register. An empty array means every change was applied.
export function applyHotkeys(changes: HotkeyChange[]): ActionId[] {
    const changing = changes.filter(
        (change) => current.get(change.id)?.accelerator !== change.accelerator
    )
    const newAccelerators = changing.map((change) => change.accelerator)

    // Swaps: a key we hold for one action can be the new key of another. Release it first,
    // otherwise registering it fails because we still hold it ourselves.
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

    // Make before break: register every new key while the old keys are still held.
    const registered: string[] = []
    const failed: ActionId[] = []
    for (const { id, accelerator, handler } of changing) {
        if (globalShortcut.register(accelerator, handler)) {
            registered.push(accelerator)
        } else {
            failed.push(id)
        }
    }

    // Something failed: undo the new keys and take the released ones back.
    if (failed.length > 0) {
        for (const accelerator of registered) {
            globalShortcut.unregister(accelerator)
        }
        for (const { accelerator, handler } of released) {
            globalShortcut.register(accelerator, handler)
        }
        return failed
    }

    // Everything worked: drop the old keys, unless another action now uses them.
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
