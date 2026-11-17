import { useEffect, useState } from 'react'
import type { Settings } from '../../shared/types'
import { HotkeyInput } from './HotkeyInput'

type HotkeyField = 'screenshotRegionHotkey' | 'screenshotFullHotkey'
type Conflict = { field: HotkeyField; accelerator: string }

const hotkeyFields: HotkeyField[] = ['screenshotRegionHotkey', 'screenshotFullHotkey']

function App(): React.JSX.Element {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [conflict, setConflict] = useState<Conflict | null>(null)
    // True while a hotkey save is in progress. Both hotkeys are disabled until it ends.
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        window.settingsApi.getSettings().then(setSettings)
    }, [])

    async function handleChooseFolder(): Promise<void> {
        const saveFolder = await window.settingsApi.chooseFolder()
        if (saveFolder === null || settings === null) return

        const next: Settings = { ...settings, saveFolder: saveFolder }
        const failed = await window.settingsApi.saveSettings(next)

        if (failed.length === 0) {
            setSettings(next)
        }
    }

    async function handleHotkeyChange(field: HotkeyField, accelerator: string): Promise<void> {
        if (settings === null) return

        // Main throws on two equal hotkeys, so catch a clash with our own hotkeys here first.
        const usedByOther = hotkeyFields.some(
            (other) => other !== field && settings[other] === accelerator
        )
        if (usedByOther) {
            setConflict({ field, accelerator })
            return
        }

        const next: Settings = { ...settings, [field]: accelerator }

        setSaving(true)
        try {
            const failed = await window.settingsApi.saveSettings(next)
            if (failed.length === 0) {
                setSettings(next)
                // Clear the red only if it belonged to this hotkey.
                setConflict((current) => (current?.field === field ? null : current))
            } else {
                setConflict({ field, accelerator })
            }
        } catch (e) {
            console.error(e)
        } finally {
            // Runs after the save, whether it worked, failed or threw.
            setSaving(false)
        }
    }

    if (settings === null) return <p>Loading...</p>

    // While a hotkey is in conflict, show the combo the user tried instead of the saved one.
    const shownAccelerator = (field: HotkeyField): string =>
        conflict?.field === field ? conflict.accelerator : settings[field]

    return (
        <main>
            <h1>Framecatch</h1>
            <p>Save screenshots to:</p>
            <code>{settings.saveFolder}</code>
            <button onClick={handleChooseFolder}>Change folder</button>
            <br />
            <p>Region screenshot hotkey:</p>
            <HotkeyInput
                accelerator={shownAccelerator('screenshotRegionHotkey')}
                conflict={conflict?.field === 'screenshotRegionHotkey'}
                disabled={saving}
                onChange={(accelerator) =>
                    handleHotkeyChange('screenshotRegionHotkey', accelerator)
                }
            />
            <p>Fullscreen screenshot hotkey:</p>
            <HotkeyInput
                accelerator={shownAccelerator('screenshotFullHotkey')}
                conflict={conflict?.field === 'screenshotFullHotkey'}
                disabled={saving}
                onChange={(accelerator) => handleHotkeyChange('screenshotFullHotkey', accelerator)}
            />
        </main>
    )
}

export default App
