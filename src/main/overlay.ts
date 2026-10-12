import { BrowserWindow, screen } from 'electron'

export function openOverlay(image: string, onCrop: (box: {x: number, y: number, width: number, height: number}) => void): void {
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  const overlay = new BrowserWindow({
    width: display.bounds.width,
    height: display.bounds.height,
    x: display.bounds.x,
    y: display.bounds.y,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    fullscreen: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  overlay.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    overlay.close()

    const parsed = new URL(url)
    if (parsed.protocol == 'capture:' && parsed.hostname === 'crop') {
      const x = parseInt(parsed.searchParams.get('x') || '0', 10)
      const y = parseInt(parsed.searchParams.get('y') || '0', 10)
      const width = parseInt(parsed.searchParams.get('w') || '0', 10)
      const height = parseInt(parsed.searchParams.get('h') || '0', 10)

      onCrop({ x, y, width, height })
    }
  })

  const html =`
  <body style="background-image: url('data:image/png;base64,${image}'); margin:0; width:100vw; height:100vh; overflow:hidden;">
  <div id="mouse_select" style="position: absolute;"></div>

  <script>
  let startX = 0
  let startY = 0
  let isDrawing = false
  const selectBox = document.getElementById('mouse_select')

  document.addEventListener("mousedown", (event) => {
      if(event.button == 0) {
        isDrawing = true
        startX = event.clientX
        startY = event.clientY

        selectBox.style.left = startX + "px"
        selectBox.style.top = startY + "px"
        selectBox.style.width = "0px"
        selectBox.style.height = "0px"
        selectBox.style.border = "2px dashed #00f"
        selectBox.style.background = "rgba(0,0,255,0.1)"
      }
    })

  document.addEventListener("mousemove", (event) => {
    if(!isDrawing) return;

    let currentX = event.clientX
    let currentY = event.clientY

    let width = Math.abs(currentX - startX)
    let height = Math.abs(currentY - startY)
    let left = Math.min(currentX, startX)
    let top = Math.min(currentY, startY)

    selectBox.style.left = left + "px"
    selectBox.style.top = top + "px"
    selectBox.style.width = width + "px"
    selectBox.style.height = height + "px"
  })

  document.addEventListener("mouseup", (event) => {
    isDrawing = false

    let width = parseInt(selectBox.style.width) || 0
    let height = parseInt(selectBox.style.height) || 0
    let left = parseInt(selectBox.style.left) || 0
    let top = parseInt(selectBox.style.top) || 0

    if(width > 5 && height > 5) {
      window.location.href = 'capture://crop?x=' + left + '&y=' + top + '&w=' + width + '&h=' + height
    }
  })
  </script>
  </body>`
  overlay.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  overlay.show()
}
