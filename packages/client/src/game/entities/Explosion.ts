export class Explosion {
  x: number
  y: number

  private age = 0 // sec
  private ttl: number // sec
  size: number // px (квадрат)

  constructor(x: number, y: number, opts: { ttl: number; size: number }) {
    this.x = x
    this.y = y
    this.ttl = opts.ttl
    this.size = opts.size
  }

  update(dt: number) {
    this.age += dt
  }

  /** 0..1 */
  get progress() {
    return this.ttl > 0 ? Math.min(1, this.age / this.ttl) : 1
  }

  get dead() {
    return this.progress >= 1
  }

  get alpha() {
    return 1 - this.progress
  }
}
