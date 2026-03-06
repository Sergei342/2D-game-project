import type { Rect } from '../engine/types'

export class Invader implements Rect {
  x: number
  y: number
  w: number
  h: number
  alive = true
  score: number

  constructor(x: number, y: number, score: number) {
    this.x = x
    this.y = y
    this.w = 44
    this.h = 34
    this.score = score
  }
}
