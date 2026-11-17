export function codeToKey(code: string): string | null {
    if (code.startsWith('Key') && code.length > 3) return code.slice(3)
    if (code.startsWith('Digit') && code.length > 5) return code.slice(5)
    return null
}

type acceleratorProps = { ctrlKey: boolean; shiftKey: boolean; altKey: boolean; code: string }

export function toAccelerator(e: acceleratorProps): string | null {
    // A letter or digit without Ctrl or Alt would block typing it in every app.
    if (!e.ctrlKey && !e.altKey) return null
    const array: string[] = []
    if (e.ctrlKey) {
        array.push('CommandOrControl')
    }
    if (e.shiftKey) {
        array.push('Shift')
    }
    if (e.altKey) {
        array.push('Alt')
    }
    const key = codeToKey(e.code)
    if (key !== null) {
        array.push(key)
    } else {
        return null
    }
    return array.join('+')
}
