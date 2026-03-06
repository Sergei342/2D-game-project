import { CANVAS_W } from '../engine/types'
import { Invader } from './Invader'

export class Fleet {
  invaders: Invader[] = []
  dir: 1 | -1 = 1
  speed = 55 // px/sec
  drop = 22 // px
  padding = 18 // screen padding
  fireEvery = 0.75 // sec
  private fireAcc = 0

  resetLevel1() {
    const rows = 5
    const cols = 10
    const invW = 44
    const invH = 34
    const gapX = 18
    const gapY = 16

    const formationWidth = cols * invW + (cols - 1) * gapX
    const startX = (CANVAS_W - formationWidth) / 2
    const startY = 110

    this.invaders = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const score = (rows - r) * 10
        this.invaders.push(
          new Invader(
            startX + c * (invW + gapX),
            startY + r * (invH + gapY),
            score
          )
        )
      }
    }

    this.dir = 1
    this.speed = 55
    this.fireAcc = 0
  }

  alive() {
    return this.invaders.filter(i => i.alive)
  }

  update(dt: number) {
    const alive = this.alive()
    if (alive.length === 0) return

    // небольшое ускорение
    const killed = this.invaders.length - alive.length
    this.speed = 55 + killed * 2.2

    let minX = Infinity
    let maxX = -Infinity

    for (const inv of alive) {
      minX = Math.min(minX, inv.x)
      maxX = Math.max(maxX, inv.x + inv.w)
    }

    const step = this.speed * dt * this.dir
    const willHitLeft = minX + step < this.padding
    const willHitRight = maxX + step > CANVAS_W - this.padding

    if (willHitLeft || willHitRight) {
      this.dir = (this.dir * -1) as 1 | -1
      for (const inv of alive) inv.y += this.drop
    } else {
      for (const inv of alive) inv.x += step
    }
  }

  // возвращает инвейдера, который стреляет, либо null
  pickShooter(dt: number): Invader | null {
    const alive = this.alive()
    if (alive.length === 0) return null

    this.fireAcc += dt
    if (this.fireAcc < this.fireEvery) return null
    this.fireAcc -= this.fireEvery

    // выбор "нижних" по колонкам
    const byCol = new Map<number, Invader>()
    for (const inv of alive) {
      const colKey = Math.round(inv.x / 10)
      const prev = byCol.get(colKey)
      if (!prev || inv.y > prev.y) byCol.set(colKey, inv)
    }
    const shooters = Array.from(byCol.values())
    return shooters[Math.floor(Math.random() * shooters.length)] ?? null
  }

  maxY(): number {
    let maxY = 0
    for (const inv of this.alive()) maxY = Math.max(maxY, inv.y + inv.h)
    return maxY
  }
}
