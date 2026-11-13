import { useEffect, useState } from 'react'
import type { Settings } from '../../shared/types'
import { HotkeyInput } from './HotkeyInput'

type HotkeyField = 'screenshotRegionHotkey' | 'screenshotFullHotkey'

function App(): React.JSX.Element {
    const [settings, setSettings] = useState<Settings | null>(null)

    useEffect(() => {
        window.settingsApi.getSettings().then(setSettings)
    }, [])

    async function handleChooseFolder(): Promise<void> {
        const saveFolder = await window.settingsApi.chooseFolder()
        if (saveFolder === null || settings === null) return

        const next: Settings = { ...settings, saveFolder: saveFolder }
        const answer = await window.settingsApi.saveSettings(next)

        if (answer) {
            setSettings(next)
        }
    }

    async function handleHotkeyChange(field: HotkeyField, accelerator: string): Promise<void> {
        if (settings === null) return
        const next: Settings = { ...settings, [field]: accelerator }

        try {
            const answer = await window.settingsApi.saveSettings(next)
            if (answer) {
                setSettings(next)
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (settings === null) return <p>Loading...</p>

    return (
        <main>
            <h1>Framecatch</h1>
            <p>Save screenshots to:</p>
            <code>{settings.saveFolder}</code>
            <button onClick={handleChooseFolder}>Change folder</button>
            <br />
            <p>Region screenshot hotkey:</p>
            <HotkeyInput
                accelerator={settings.screenshotRegionHotkey}
                onChange={(accelerator) =>
                    handleHotkeyChange('screenshotRegionHotkey', accelerator)
                }
            />
            <p>Fullscreen screenshot hotkey:</p>
            <HotkeyInput
                accelerator={settings.screenshotFullHotkey}
                onChange={(accelerator) => handleHotkeyChange('screenshotFullHotkey', accelerator)}
            />
        </main>
    )
}

export default App
