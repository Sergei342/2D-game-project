import { CANVAS_W } from './types'

export type LevelId = 1 | 2 | 3

export type ShieldSpec = { x: number; y: number; w: number; h: number }

export type LevelConfig = {
  id: LevelId
  enemyFireEvery: number // секунды
  shields: ShieldSpec[]
}

export const LEVELS: ReadonlyArray<LevelConfig> = [
  {
    id: 1,
    enemyFireEvery: 0.75,
    shields: [],
  },
  {
    id: 2,
    enemyFireEvery: 0.75,
    shields: [
      { x: CANVAS_W * 0.12, y: 600, w: 110, h: 70 },
      { x: CANVAS_W * 0.34, y: 600, w: 110, h: 70 },
      { x: CANVAS_W * 0.56, y: 600, w: 110, h: 70 },
      { x: CANVAS_W * 0.78, y: 600, w: 110, h: 70 },
    ],
  },
  {
    id: 3,
    enemyFireEvery: 0.4, // интенсивнее
    shields: [
      { x: CANVAS_W * 0.18, y: 565, w: 140, h: 82 },
      { x: CANVAS_W * 0.42, y: 615, w: 140, h: 82 },
      { x: CANVAS_W * 0.66, y: 565, w: 140, h: 82 },
    ],
  },
]
