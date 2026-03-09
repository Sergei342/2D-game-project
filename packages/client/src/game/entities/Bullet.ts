import type { Rect } from '../engine/types'

export type BulletOwner = 'player' | 'enemy'

export class Bullet implements Rect {
  x: number
  y: number
  w: number
  h: number
  vy: number
  owner: BulletOwner

  dead = false

  constructor(opts: { x: number; y: number; vy: number; owner: BulletOwner }) {
    this.x = opts.x
    this.y = opts.y
    this.w = 6
    this.h = 14
    this.vy = opts.vy
    this.owner = opts.owner
  }

  update(dt: number) {
    this.y += this.vy * dt
  }

  isOffscreen(screenH: number) {
    return this.y + this.h < 0 || this.y > screenH
  }

  center() {
    return { cx: this.x + this.w / 2, cy: this.y + this.h / 2 }
  }
}
