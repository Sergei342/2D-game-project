import { CANVAS_W } from '../engine/types'
import { Player } from './Player'
import { Bullet } from './Bullet'

describe('Player', () => {
  let p: Player

  beforeEach(() => {
    p = new Player()
  })

  it('check reset', () => {
    p.x = 100
    p.lives = 1
    p.score = 9999
    p.reset()
    expect(p.x).toBe(CANVAS_W / 2 - p.w / 2)
    expect(p.lives).toBe(3)
    expect(p.score).toBe(0)
  })

  it('check update', () => {
    p.x = 300

    p.update(0.1, 0)

    expect(p.x).toBe(300)
  })

  it('tryShoot returns null when isShooting is false', () => {
    expect(p.tryShoot(false)).toBeNull()
  })

  it('tryShoot returns null when fireCooldown is active', () => {
    p.tryShoot(true)

    const result = p.tryShoot(true)

    expect(result).toBeNull()
  })

  it('tryShoot returns a Bullet when isShooting is true and cooldown is 0', () => {
    const bullet = p.tryShoot(true)

    expect(bullet).toBeInstanceOf(Bullet)
    expect(bullet?.x).toBe(p.x + p.w / 2 - 3)
    expect(bullet?.y).toBe(p.y - 10)
    expect(bullet?.vy).toBe(-760)
    expect(bullet?.owner).toBe('player')
  })

  it('tryShoot sets fireCooldown to 0.18 after shooting', () => {
    p.tryShoot(true)

    p.update(0.17, 0)
    expect(p.tryShoot(true)).toBeNull()

    p.update(0.01, 0)
    const bullet = p.tryShoot(true)
    expect(bullet).toBeInstanceOf(Bullet)
  })
})
