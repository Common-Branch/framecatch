import { desktopCapturer, screen } from 'electron'

export async function takeFullscreenScreenshot(): Promise<Buffer> {
  const activeMonitor = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())

  // Windows display scaling
  const scale = activeMonitor.scaleFactor
  const thumbnailSize = {
    width: Math.round(activeMonitor.size.width * scale),
    height: Math.round(activeMonitor.size.height * scale)
  }

  const screens = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: thumbnailSize
  })

  if (screens.length === 0) throw new Error('No screens available')

  const primarySource = screens.find((s) => s.display_id === String(activeMonitor.id)) ?? screens[0]

  if (!primarySource) throw new Error('Primary display not found')
  const png = primarySource.thumbnail.toPNG()

  return png
}
