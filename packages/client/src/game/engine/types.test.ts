import { clamp, intersectsRect, Rect } from './types'

it('test clamp', () => {
  expect(clamp(-5, 0, 10)).toBe(0)
  expect(clamp(15, 0, 10)).toBe(10)
  expect(clamp(5, 0, 10)).toBe(5)
  expect(clamp(0, 0, 10)).toBe(0)
  expect(clamp(10, 0, 10)).toBe(10)
  expect(clamp(0, 0, 0)).toBe(0)
})

describe('intersectsRect', () => {
  it('should return true when two rects overlap', () => {
    const a: Rect = { x: 0, y: 0, w: 20, h: 20 }
    const b: Rect = { x: 10, y: 10, w: 20, h: 20 }
    expect(intersectsRect(a, b)).toBe(true)
  })

  it('should return true when one rect is fully inside another', () => {
    const a: Rect = { x: 0, y: 0, w: 100, h: 100 }
    const b: Rect = { x: 10, y: 10, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(true)
  })

  it('should return false when rect a is entirely to the right of rect b', () => {
    const a: Rect = { x: 50, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 0, y: 0, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return false when rect a is entirely to the left of rect b', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 50, y: 0, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return false when rect a is entirely above rect b', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 0, y: 50, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return false when rect a is entirely below rect b', () => {
    const a: Rect = { x: 0, y: 50, w: 10, h: 10 }
    const b: Rect = { x: 0, y: 0, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return false when rects share an edge horizontally (touching but not overlapping)', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 10, y: 0, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return false when rects share an edge vertically (touching but not overlapping)', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 0, y: 10, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(false)
  })

  it('should return true when rects overlap by just one pixel', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 9, y: 9, w: 10, h: 10 }
    expect(intersectsRect(a, b)).toBe(true)
  })
})
