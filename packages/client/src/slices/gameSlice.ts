import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { LevelId } from '@/game/engine/Level'

export type GameState = {
  score: number
  level: LevelId
}

const initialState: GameState = {
  score: 0,
  level: 1,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGame: (state, { payload }: PayloadAction<Partial<GameState>>) => {
      Object.assign(state, payload)
    },
  },
})

export const selectScore = (state: RootState) => state.game.score

export const selectLevel = (state: RootState) => state.game.level

export const { updateGame } = gameSlice.actions

export default gameSlice.reducer
