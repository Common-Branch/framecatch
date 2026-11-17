import { useEffect, useState } from 'react'
import { toKeyLabel } from './keyLabels'
import { toAccelerator } from './accelerator'

type HotkeyInputProps = {
    accelerator: string
    conflict: boolean
    disabled: boolean
    onChange: (accelerator: string) => void
}

export function HotkeyInput({
    accelerator,
    conflict,
    disabled,
    onChange
}: HotkeyInputProps): React.JSX.Element {
    const [recording, setRecording] = useState<boolean>(false)

    useEffect(() => {
        if (!recording) return
        window.settingsApi.pauseHotkeys()
        return () => window.settingsApi.resumeHotkeys()
    }, [recording])

    // The states only React knows become class names. app.css styles them.
    let className = 'hotkey'
    if (recording) className += ' recording'
    if (conflict) className += ' conflict'

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={() => setRecording(!recording)}
            onKeyDown={(e) => {
                if (recording) {
                    e.preventDefault()
                    if (e.code === 'Escape') {
                        setRecording(false)
                        return
                    }
                    const result = toAccelerator(e)
                    if (result !== null) {
                        onChange(result)
                        setRecording(false)
                    }
                }
            }}
            onBlur={() => setRecording(false)}
        >
            {recording ? (
                <kbd className="keycap">
                    <span className="keycap-face">Press keys</span>
                </kbd>
            ) : (
                accelerator.split('+').map((part) => (
                    <kbd key={part} className="keycap">
                        <span className="keycap-face">{toKeyLabel(part)}</span>
                    </kbd>
                ))
            )}
        </button>
    )
}
