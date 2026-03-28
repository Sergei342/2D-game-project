import { GameEvent } from '@/game/engine/Game'

export const modalEvents: GameEvent['type'][] = [
  'levelComplete',
  'win',
  'gameover',
]
