import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import friendsReducer from './slices/friendsSlice'
import ssrReducer from './slices/ssrSlice'
import userReducer from './slices/userSlice'
import gameReducer from './slices/gameSlice'
import { api } from './api/baseApi'
import { apiErrorMiddleware } from './api/apiErrorMiddleware'
import { apiForum } from './api/forumApi'

declare global {
  interface Window {
    APP_INITIAL_STATE: RootState
  }
}

export const reducer = combineReducers({
  friends: friendsReducer,
  ssr: ssrReducer,
  user: userReducer,
  game: gameReducer,
  [api.reducerPath]: api.reducer,
  [apiForum.reducerPath]: apiForum.reducer,
})

export type RootState = ReturnType<typeof reducer>

export const createAppStore = () => {
  const store = configureStore({
    reducer,
    preloadedState:
      typeof window !== 'undefined' ? window.APP_INITIAL_STATE : undefined,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        api.middleware,
        apiForum.middleware,
        apiErrorMiddleware
      ),
  })

  return store
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']

export const useDispatch = () => useDispatchBase<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore = () => useStoreBase() as AppStore
