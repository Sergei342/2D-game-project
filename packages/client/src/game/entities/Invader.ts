import type { Rect } from '../engine/types'

export class Invader implements Rect {
  x: number
  y: number
  w: number
  h: number

  readonly row: number
  readonly col: number

  alive = true
  readonly score: number

  constructor(opts: {
    x: number
    y: number
    row: number
    col: number
    score: number
  }) {
    this.x = opts.x
    this.y = opts.y
    this.w = 44
    this.h = 34

    this.row = opts.row
    this.col = opts.col
    this.score = opts.score
  }
}
