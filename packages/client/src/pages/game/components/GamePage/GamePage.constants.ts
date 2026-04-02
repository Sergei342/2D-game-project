import { GameEvent } from '@/game/engine/Game'

export const modalEvents: GameEvent['type'][] = [
  'levelComplete',
  'win',
  'gameover',
]

export const leaderBoardEvents: GameEvent['type'][] = ['win', 'gameover']
