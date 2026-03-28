import { Explosion } from './Explosion'

describe('Explosion', () => {
  it('update age, check progress', () => {
    const explosion = new Explosion(0, 0, { ttl: 2, size: 16 })
    //this.ttl > 0 ? Math.min(1, this.age / this.ttl) : 1
    expect(explosion.progress).toBe(0)

    explosion.update(1)

    expect(explosion.progress).toBe(0.5)
  })

  it('check dead is false while alive, true when progress >= 1', () => {
    const explosion = new Explosion(0, 0, { ttl: 1, size: 16 })
    //this.ttl > 0 ? Math.min(1, this.age / this.ttl) : 1
    expect(explosion.dead).toBe(false)

    explosion.update(1)

    expect(explosion.dead).toBe(true)
  })

  it('check calc alpha', () => {
    const e = new Explosion(0, 0, { ttl: 1, size: 16 })
    // 1 - this.progress
    expect(e.alpha).toBe(1)

    e.update(0.5)

    expect(e.alpha).toBe(0.5)

    e.update(0.5)

    expect(e.alpha).toBe(0)
  })
})
