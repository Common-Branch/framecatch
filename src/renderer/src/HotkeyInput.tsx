import { useState } from 'react'
import { toKeyLabel } from './keyLabels'

type HotkeyInputProps = { accelerator: string }

export function HotkeyInput({ accelerator }: HotkeyInputProps): React.JSX.Element {
    const [recording, setRecording] = useState<boolean>(false)

    return (
        <button onClick={() => setRecording(!recording)}>
            {recording
                ? 'Listening'
                : accelerator.split('+').map((part) => <kbd key={part}>{toKeyLabel(part)}</kbd>)}
        </button>
    )
}
