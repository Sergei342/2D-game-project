export const CANVAS_W = 800 as const
export const CANVAS_H = 800 as const

export type Rect = { x: number; y: number; w: number; h: number }

export type GameState = 'start' | 'playing' | 'between' | 'win' | 'gameover'

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function intersectsRect(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  )
}
