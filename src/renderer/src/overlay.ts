interface Rect {
    x: number
    y: number
    width: number
    height: number
}

interface Point {
    x: number
    y: number
}

let currentRect: Rect = { x: 0, y: 0, width: 0, height: 0 }
const start: Point = { x: 0, y: 0 }
let isDrawing = false

const screenshot = document.getElementById('screenshot')
if (!(screenshot instanceof HTMLImageElement))
    throw new Error('#screenshot not found in overlay.html')

window.overlayApi.getImage().then((base64) => {
    screenshot.src = 'data:image/png;base64,' + base64
})

const selectBox = document.getElementById('mouse_select')
if (!(selectBox instanceof HTMLDivElement))
    throw new Error('#mouse_select not found in overlay.html')

const draw = (): void => {
    selectBox.style.left = currentRect.x + 'px'
    selectBox.style.top = currentRect.y + 'px'
    selectBox.style.width = currentRect.width + 'px'
    selectBox.style.height = currentRect.height + 'px'
}

function rectFromPoints(a: Point, b: Point): Rect {
    return {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(a.x - b.x),
        height: Math.abs(a.y - b.y)
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.overlayApi.close()
    }
})

document.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return
    isDrawing = true
    start.x = event.clientX
    start.y = event.clientY
    currentRect = rectFromPoints(start, start)
    selectBox.style.border = '2px dashed white'
    selectBox.style.borderRadius = '2px'
    draw()
})

document.addEventListener('mousemove', (event) => {
    if (!isDrawing) return
    currentRect = rectFromPoints(start, { x: event.clientX, y: event.clientY })
    draw()
})

document.addEventListener('mouseup', () => {
    if (!isDrawing) return
    isDrawing = false
    if (currentRect.width > 8 && currentRect.height > 8) {
        window.overlayApi.crop(currentRect)
    }
})
