import { CANVAS_W } from '../engine/types'
import { Invader } from './Invader'

export type FleetShot = { x: number; y: number } | null

export interface IFleet {
  resetLevel1Formation(): void
  update(dt: number): void

  setEnemyFireEvery(v: number): void
  tryPickShot(dt: number): FleetShot

  getAliveCount(): number
  maxY(): number

  forEachAlive(fn: (inv: Invader) => void): void

  // Попадание по флоту: вернёт scoreGain (0 если промах)
  hitTestAndKill(rect: { x: number; y: number; w: number; h: number }): number
}

export class Fleet implements IFleet {
  private invaders: Invader[] = []
  private aliveCount = 0

  private dir: 1 | -1 = 1
  private speed = 55 // px/sec
  private drop = 22 // px
  private padding = 18

  private fireEvery = 0.75
  private fireAcc = 0

  private cols = 10

  resetLevel1Formation() {
    const rows = 5
    const cols = 10

    this.cols = cols

    const invW = 44
    const invH = 34
    const gapX = 18
    const gapY = 16

    const formationWidth = cols * invW + (cols - 1) * gapX
    const startX = (CANVAS_W - formationWidth) / 2
    const startY = 110

    const next: Invader[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const score = (rows - r) * 10
        next.push(
          new Invader({
            x: startX + c * (invW + gapX),
            y: startY + r * (invH + gapY),
            row: r,
            col: c,
            score,
          })
        )
      }
    }

    this.invaders = next
    this.aliveCount = next.length

    this.dir = 1
    this.speed = 55
    this.fireAcc = 0
  }

  setEnemyFireEvery(v: number) {
    this.fireEvery = Math.max(0.08, v)
  }

  getAliveCount() {
    return this.aliveCount
  }

  forEachAlive(fn: (inv: Invader) => void) {
    for (const inv of this.invaders) if (inv.alive) fn(inv)
  }

  private computeBounds() {
    let minX = Infinity
    let maxX = -Infinity

    this.forEachAlive(inv => {
      minX = Math.min(minX, inv.x)
      maxX = Math.max(maxX, inv.x + inv.w)
    })

    return { minX, maxX }
  }

  update(dt: number) {
    if (this.aliveCount === 0) return

    // ускорение по мере убийств
    const killed = this.invaders.length - this.aliveCount
    this.speed = 55 + killed * 2.2

    const { minX, maxX } = this.computeBounds()
    const step = this.speed * dt * this.dir

    const willHitLeft = minX + step < this.padding
    const willHitRight = maxX + step > CANVAS_W - this.padding

    if (willHitLeft || willHitRight) {
      this.dir = this.dir === 1 ? -1 : 1
      this.forEachAlive(inv => {
        inv.y += this.drop
      })
      return
    }

    this.forEachAlive(inv => {
      inv.x += step
    })
  }

  maxY() {
    let maxY = 0
    this.forEachAlive(inv => {
      maxY = Math.max(maxY, inv.y + inv.h)
    })
    return maxY
  }

  tryPickShot(dt: number): FleetShot {
    if (this.aliveCount === 0) return null

    this.fireAcc += dt
    if (this.fireAcc < this.fireEvery) return null
    this.fireAcc -= this.fireEvery

    // стреляют нижние в колонках: для каждого col берём invader с максимальным y
    const bottomByCol: Array<Invader | null> = Array.from(
      { length: this.cols },
      () => null
    )

    this.forEachAlive(inv => {
      const prev = bottomByCol[inv.col]
      if (!prev || inv.y > prev.y) bottomByCol[inv.col] = inv
    })

    const shooters = bottomByCol.filter((x): x is Invader => x !== null)
    if (shooters.length === 0) return null

    const shooter = shooters[Math.floor(Math.random() * shooters.length)]
    return { x: shooter.x + shooter.w / 2 - 3, y: shooter.y + shooter.h + 6 }
  }

  hitTestAndKill(rect: { x: number; y: number; w: number; h: number }) {
    for (const inv of this.invaders) {
      if (!inv.alive) continue

      const hit =
        rect.x < inv.x + inv.w &&
        rect.x + rect.w > inv.x &&
        rect.y < inv.y + inv.h &&
        rect.y + rect.h > inv.y

      if (!hit) continue

      inv.alive = false
      this.aliveCount = Math.max(0, this.aliveCount - 1)
      return inv.score
    }
    return 0
  }
}
