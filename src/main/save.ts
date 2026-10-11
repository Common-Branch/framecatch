import { writeFile } from 'fs/promises'
import { app } from 'electron'
import { join } from 'path'

export async function savePng(png: Buffer): Promise<string> {
  const desktop = app.getPath('desktop')
  const filename = `framecatch-${Date.now()}.png`
  const file = join(desktop, filename)

  await writeFile(file, png)
  return file
}
