const labels: Record<string, string> = {
    CommandOrControl: 'Ctrl',
    Escape: 'Esc'
}

export function toKeyLabel(part: string): string {
    return labels[part] ?? part
}
