import { describe, expect, test } from 'vitest'
import { toKeyLabel } from './keyLabels'

describe('toKeyLabel', () => {
    test('shows CommandOrControl as Ctrl', () => {
        expect(toKeyLabel('CommandOrControl')).toBe('Ctrl')
    })

    test('returns names without a label unchanged', () => {
        expect(toKeyLabel('S')).toBe('S')
    })
})
