import { dialog, nativeImage } from 'electron'
import { takeFullscreenScreenshot } from './capture'
import { openOverlay } from './overlay'
import { savePng } from './save'

let busy = false

// Runs a task only if no other task is running
async function runExclusive(task: () => Promise<void>): Promise<void> {
    if (busy) return
    busy = true
    try {
        await task()
    } catch (e) {
        console.error("Couldn't take and save a screenshot:", e)
        dialog.showErrorBox('Screenshot failed', e instanceof Error ? e.message : String(e))
    } finally {
        busy = false
    }
}

export function captureFullscreen(): Promise<void> {
    return runExclusive(async () => {
        const { png } = await takeFullscreenScreenshot()
        await savePng(png)
    })
}

export function captureRegion(): Promise<void> {
    return runExclusive(async () => {
        const { png, display } = await takeFullscreenScreenshot()
        const rect = await openOverlay(png.toString('base64'), display)
        if (rect === null) return

        const scale = display.scaleFactor
        const cropped = nativeImage.createFromBuffer(png).crop({
            x: Math.round(rect.x * scale),
            y: Math.round(rect.y * scale),
            width: Math.round(rect.width * scale),
            height: Math.round(rect.height * scale)
        })
        await savePng(cropped.toPNG())
    })
}
