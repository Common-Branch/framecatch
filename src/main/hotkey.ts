import { globalShortcut } from 'electron'

// Predefined set of possible shortcuts for various features
export type ActionId = 'screenshot-full' | 'screenshot-region' | 'record-full'

// Table for keeping track of currently set shortcuts
const current = new Map<ActionId, string>()

export function registerAction(id: ActionId, accelerator: string, handler: () => void): boolean {
  // Unregister previous shortcut for the action if exists
  const old = current.get(id)
  if (old && old !== accelerator) globalShortcut.unregister(old)

  // Register new shortcut for the action
  const ok = globalShortcut.register(accelerator, handler)
  if (ok) current.set(id, accelerator)

  return ok
}

export function unregisterAction(id: ActionId): void {
  // Check if the action has a shortcut attached to it
  const accelerator = current.get(id)
  if (accelerator) {
    globalShortcut.unregister(accelerator)
    current.delete(id)
  }

  // No return since unregisterAction is void
}
