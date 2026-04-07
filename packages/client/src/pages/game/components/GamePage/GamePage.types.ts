import { GameEvent } from '@/game/engine/Game'
import { leaderBoardEvents, modalEvents } from './GamePage.constants'

type ModalEvent = Extract<
  GameEvent,
  { type: 'gameover' | 'win' | 'levelComplete' }
>

type LeaderBoardEvent = Extract<
  GameEvent,
  { type: 'score' | 'gameover' | 'win' | 'levelComplete' }
>

export const isModalEvent = (e: GameEvent): e is ModalEvent => {
  return modalEvents.includes(e.type)
}

export const isLeaderBoardEvent = (e: GameEvent): e is LeaderBoardEvent => {
  return leaderBoardEvents.includes(e.type)
}
