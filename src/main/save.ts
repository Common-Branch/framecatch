import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getSettings } from './settings'
import { mkdir } from 'fs/promises'

export async function savePng(png: Buffer): Promise<string> {
    const { saveFolder } = getSettings()
    await mkdir(saveFolder, { recursive: true })
    const filename = `framecatch-${Date.now()}.png`
    const file = join(saveFolder, filename)

    await writeFile(file, png)
    return file
}
