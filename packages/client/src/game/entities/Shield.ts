import type { Rect } from '@/engine/types'

export class Shield implements Rect {
  x: number
  y: number
  w: number
  h: number

  private buffer: HTMLCanvasElement
  private bctx: CanvasRenderingContext2D

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.buffer = document.createElement('canvas')
    this.buffer.width = Math.max(1, Math.floor(w))
    this.buffer.height = Math.max(1, Math.floor(h))

    const ctx = this.buffer.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Shield buffer ctx not available')
    this.bctx = ctx
  }

  bakeFromImage(img: HTMLImageElement) {
    this.bctx.clearRect(0, 0, this.buffer.width, this.buffer.height)
    this.bctx.imageSmoothingEnabled = false
    this.bctx.drawImage(img, 0, 0, this.buffer.width, this.buffer.height)
  }

  bakeFallback() {
    this.bctx.clearRect(0, 0, this.buffer.width, this.buffer.height)
    this.bctx.fillStyle = 'rgba(120, 255, 150, 0.95)'
    this.bctx.fillRect(0, 0, this.buffer.width, this.buffer.height)

    // лёгкая пиксельность
    this.bctx.clearRect(
      this.buffer.width * 0.2,
      this.buffer.height * 0.55,
      this.buffer.width * 0.2,
      this.buffer.height * 0.2
    )
    this.bctx.clearRect(
      this.buffer.width * 0.6,
      this.buffer.height * 0.55,
      this.buffer.width * 0.2,
      this.buffer.height * 0.2
    )
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(this.buffer, this.x, this.y, this.w, this.h)
  }

  hasPixelAt(worldX: number, worldY: number): boolean {
    if (
      worldX < this.x ||
      worldX >= this.x + this.w ||
      worldY < this.y ||
      worldY >= this.y + this.h
    )
      return false

    const lx = Math.floor(((worldX - this.x) / this.w) * this.buffer.width)
    const ly = Math.floor(((worldY - this.y) / this.h) * this.buffer.height)
    const data = this.bctx.getImageData(lx, ly, 1, 1)
    return data.data[3] !== 0
  }

  damageAt(worldX: number, worldY: number, radiusWorld = 11) {
    const lx = ((worldX - this.x) / this.w) * this.buffer.width
    const ly = ((worldY - this.y) / this.h) * this.buffer.height
    const r = (radiusWorld / this.w) * this.buffer.width

    this.bctx.save()
    this.bctx.globalCompositeOperation = 'destination-out'
    this.bctx.beginPath()
    this.bctx.arc(lx, ly, Math.max(2, r), 0, Math.PI * 2)
    this.bctx.fill()
    this.bctx.restore()
  }
}
