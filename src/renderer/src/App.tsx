import { useEffect, useState } from 'react'
import type { Settings } from '../../shared/types'

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

    if (settings === null) return <p>Loading...</p>

    return (
        <main>
            <h1>Framecatch</h1>
            <p>Save screenshots to:</p>
            <code>{settings.saveFolder}</code>
            <button onClick={handleChooseFolder}>Change folder</button>
        </main>
    )
}

export default App
