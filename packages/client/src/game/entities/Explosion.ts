export class Explosion {
  x: number
  y: number

  age = 0 // sec
  ttl: number // sec
  size: number // px (квадрат)

  constructor(x: number, y: number, opts?: { ttl?: number; size?: number }) {
    this.x = x
    this.y = y
    this.ttl = opts?.ttl ?? 0.22
    this.size = opts?.size ?? 56
  }

  update(dt: number) {
    this.age += dt
  }

  get dead() {
    return this.age >= this.ttl
  }

  // Простой fade-out
  get alpha() {
    const t = Math.min(1, this.age / this.ttl)
    return 1 - t
  }
}
