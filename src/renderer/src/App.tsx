import { useEffect, useState } from 'react'
import type { Settings } from '../../shared/types'

function App(): React.JSX.Element {
    const [settings, setSettings] = useState<Settings | null>(null)

    useEffect(() => {
        window.settingsApi.getSettings().then(setSettings)
    }, [])

    async function handleChooseFolder(): Promise<void> {
        const folder = await window.settingsApi.chooseFolder()
        if (folder === null) return

        const next: Settings = { saveFolder: folder }
        await window.settingsApi.saveSettings()
        setSettings(next)
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
