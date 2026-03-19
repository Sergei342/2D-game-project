import { Fleet } from './Fleet'
import { CANVAS_W } from '../engine/types'

type Rect = { x: number; y: number; w: number; h: number }
type InvInfo = Rect & { score: number }

describe('Fleet', () => {
  let fleet: Fleet

  beforeEach(() => {
    fleet = new Fleet()
    fleet.resetLevel1Formation()
  })

  function killAll(f: Fleet) {
    const alive: Rect[] = []
    f.forEachAlive(inv => alive.push(inv))
    alive.forEach(inv => f.hitTestAndKill(inv))
  }

  function firstAlive(f: Fleet): InvInfo {
    let t: InvInfo | null = null
    f.forEachAlive(inv => {
      if (!t) t = inv
    })
    if (!t) throw new Error('no alive invaders')
    return t
  }

  it('builds 50 invaders, correct grid/scores/maxY, empty fleet maxY=0', () => {
    expect(fleet.getAliveCount()).toBe(50)

    const ys = new Set<number>()
    const xs: number[] = []
    const topScores: number[] = []
    const botScores: number[] = []

    fleet.forEachAlive(inv => {
      ys.add(inv.y)
      if (inv.y === 110) {
        xs.push(inv.x)
        topScores.push(inv.score)
      }
      if (inv.y === 310) botScores.push(inv.score)
    })

    expect([...ys].sort((a, b) => a - b)).toEqual([110, 160, 210, 260, 310])
    xs.sort((a, b) => a - b)
    for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBe(62)
    expect(xs[0]).toBe((CANVAS_W - (10 * 44 + 9 * 18)) / 2)

    topScores.forEach(s => expect(s).toBe(50))
    botScores.forEach(s => expect(s).toBe(10))

    expect(fleet.maxY()).toBe(344)
    expect(new Fleet().maxY()).toBe(0)
  })

  it('moves right, bounces with drop, accelerates on kills, no-throw on empty', () => {
    const xBefore: number[] = []
    fleet.forEachAlive(inv => xBefore.push(inv.x))
    fleet.update(0.016)
    let i = 0
    fleet.forEachAlive(inv =>
      expect(inv.x).toBeCloseTo(xBefore[i++] + 55 * 0.016, 5)
    )

    for (let j = 0; j < 5000; j++) fleet.update(0.016)
    let maxDrop = 0
    fleet.forEachAlive(inv => {
      maxDrop = Math.max(maxDrop, inv.y - 310)
    })
    expect(maxDrop).toBeGreaterThanOrEqual(44)

    fleet.resetLevel1Formation()
    for (let j = 0; j < 10; j++) fleet.hitTestAndKill(firstAlive(fleet))
    const xb: number[] = [],
      xa: number[] = []
    fleet.forEachAlive(inv => xb.push(inv.x))
    fleet.update(0.1)
    fleet.forEachAlive(inv => xa.push(inv.x))
    expect(xa[0] - xb[0]).toBeGreaterThan(55 * 0.1)

    killAll(fleet)
    expect(() => fleet.update(0.016)).not.toThrow()
  })

  it('returns score on hit, null on miss/dead/empty, decrements count', () => {
    const t = firstAlive(fleet)
    const rect: Rect = { x: t.x + 1, y: t.y + 1, w: 6, h: 16 }
    const hit = fleet.hitTestAndKill(rect)

    expect(hit).toMatchObject({ scoreGain: t.score, x: t.x, y: t.y })
    expect(fleet.getAliveCount()).toBe(49)
    expect(fleet.hitTestAndKill(rect)).toBeNull()

    expect(fleet.hitTestAndKill({ x: -100, y: -100, w: 2, h: 2 })).toBeNull()

    killAll(fleet)
    expect(fleet.hitTestAndKill({ x: 0, y: 0, w: 9999, h: 9999 })).toBeNull()
    expect(fleet.getAliveCount()).toBe(0)
  })

  it('fires after cooldown, respects setEnemyFireEvery clamp, null on empty', () => {
    expect(fleet.tryPickShot(0.01)).toBeNull()

    const shot = fleet.tryPickShot(1.0)

    expect(shot).not.toBeNull()
    expect(shot?.y).toBe(310 + 34 + 6)

    fleet.setEnemyFireEvery(0.01)
    expect(fleet.tryPickShot(0.09)).not.toBeNull()

    fleet.setEnemyFireEvery(2.0)
    expect(fleet.tryPickShot(1.5)).toBeNull()
    expect(fleet.tryPickShot(1.0)).not.toBeNull()

    killAll(fleet)
    expect(fleet.tryPickShot(10.0)).toBeNull()
  })
})
