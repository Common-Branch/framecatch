import { describe, expect, test } from 'vitest'
import { toAccelerator } from './accelerator'

const none = { ctrlKey: false, shiftKey: false, altKey: false }

describe('toAccelerator', () => {
    test('turns Ctrl and a letter into an accelerator', () => {
        expect(toAccelerator({ ...none, ctrlKey: true, code: 'KeyS' })).toBe('CommandOrControl+S')
    })

    test('turns Alt and a digit into an accelerator', () => {
        expect(toAccelerator({ ...none, altKey: true, code: 'Digit5' })).toBe('Alt+5')
    })

    test('puts modifiers in the order Ctrl, Shift, Alt', () => {
        const all = { ctrlKey: true, shiftKey: true, altKey: true, code: 'KeyS' }
        expect(toAccelerator(all)).toBe('CommandOrControl+Shift+Alt+S')
    })

    test('rejects a letter without modifiers', () => {
        expect(toAccelerator({ ...none, code: 'KeyS' })).toBeNull()
    })

    test('rejects a letter with only Shift', () => {
        expect(toAccelerator({ ...none, shiftKey: true, code: 'KeyS' })).toBeNull()
    })

    test('rejects keys that are not letters or digits', () => {
        expect(toAccelerator({ ...none, ctrlKey: true, code: 'F9' })).toBeNull()
    })

    test('rejects a code with no key name after the prefix', () => {
        expect(toAccelerator({ ...none, ctrlKey: true, code: 'Key' })).toBeNull()
    })
})
