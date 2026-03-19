import { Bullet } from './Bullet'

describe('Bullet', () => {
  it('check update', () => {
    const bullet = new Bullet({ x: 0, y: 100, vy: -200, owner: 'player' })
    bullet.update(0.5)
    // 100 + (-200)*0.5
    expect(bullet.y).toBe(0)
  })

  it('check offscreen true', () => {
    const bullet = new Bullet({ x: 0, y: -20, vy: -1, owner: 'player' })
    // y + h = -20 + 14 = -6 < 0
    expect(bullet.isOffscreen(600)).toBe(true)
  })

  it('check offscreen false', () => {
    const bullet = new Bullet({ x: 0, y: 300, vy: -1, owner: 'player' })
    // y + h = 300 + 14 = 314 > 0 && 314 < screenH
    expect(bullet.isOffscreen(600)).toBe(false)
  })

  it('check offscreen true', () => {
    const bullet = new Bullet({ x: 0, y: 800, vy: -1, owner: 'player' })
    // y > screenH
    expect(bullet.isOffscreen(600)).toBe(true)
  })

  it('should return center of bullet', () => {
    const bullet = new Bullet({ x: 10, y: 20, vy: 0, owner: 'player' })
    // 10+3, 20+7
    expect(bullet.center()).toEqual({ cx: 13, cy: 27 })
  })
})
