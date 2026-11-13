import { useState } from 'react'
import { toKeyLabel } from './keyLabels'
import { toAccelerator } from './accelerator'

type HotkeyInputProps = { accelerator: string; onChange: (accelerator: string) => void }

export function HotkeyInput({ accelerator, onChange }: HotkeyInputProps): React.JSX.Element {
    const [recording, setRecording] = useState<boolean>(false)

    return (
        <button
            onClick={() => setRecording(!recording)}
            onKeyDown={(e) => {
                if (recording) {
                    const result = toAccelerator(e)
                    if (result !== null) {
                        onChange(result)
                        setRecording(false)
                    }
                }
            }}
            onBlur={() => setRecording(false)}
        >
            {recording
                ? 'Listening'
                : accelerator.split('+').map((part) => <kbd key={part}>{toKeyLabel(part)}</kbd>)}
        </button>
    )
}
