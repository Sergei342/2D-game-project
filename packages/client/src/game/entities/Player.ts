import { CANVAS_W, clamp } from '../engine/types'
import { Bullet } from './Bullet'

export class Player {
  x = CANVAS_W / 2 - 28
  y = 710
  w = 56
  h = 56

  speed = 420 // px/sec
  lives = 3
  score = 0

  private fireCooldown = 0 // sec

  reset() {
    this.x = CANVAS_W / 2 - this.w / 2
    this.lives = 3
    this.score = 0
    this.fireCooldown = 0
  }

  update(dt: number, moveDir: -1 | 0 | 1) {
    this.x += moveDir * this.speed * dt
    this.x = clamp(this.x, 12, CANVAS_W - this.w - 12)
    this.fireCooldown = Math.max(0, this.fireCooldown - dt)
  }

  tryShoot(isShooting: boolean) {
    if (!isShooting || this.fireCooldown > 0) return null

    this.fireCooldown = 0.18
    return new Bullet({
      x: this.x + this.w / 2 - 3,
      y: this.y - 10,
      vy: -760,
      owner: 'player',
    })
  }
}
