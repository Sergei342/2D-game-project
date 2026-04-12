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
import forumReducer, { ForumState } from './slices/forumSlice'
import { api } from './api/baseApi'
import { apiErrorMiddleware } from './api/apiErrorMiddleware'

const FORUM_STORAGE_KEY = 'forum_state_v1'

const loadForumState = (): ForumState | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const raw = localStorage.getItem(FORUM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ForumState) : undefined
  } catch {
    return undefined
  }
}

const saveForumState = (state: ForumState) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export const reducer = combineReducers({
  friends: friendsReducer,
  ssr: ssrReducer,
  user: userReducer,
  forum: forumReducer,
  game: gameReducer,
  [api.reducerPath]: api.reducer,
})

export type RootState = ReturnType<typeof reducer>

declare global {
  interface Window {
    APP_INITIAL_STATE?: RootState
  }
}

const getPreloadedState = (
  preloadedState?: RootState
): RootState | undefined => {
  if (typeof window === 'undefined') {
    return preloadedState
  }

  const baseState = preloadedState ?? window.APP_INITIAL_STATE

  if (!baseState) {
    return undefined
  }

  return {
    ...baseState,
    forum: loadForumState() ?? baseState.forum,
  }
}

export const createAppStore = (preloadedState?: RootState) => {
  const createdStore = configureStore({
    reducer,
    preloadedState: getPreloadedState(preloadedState),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(api.middleware, apiErrorMiddleware),
  })

  if (typeof window !== 'undefined') {
    createdStore.subscribe(() => {
      saveForumState(createdStore.getState().forum)
    })
  }

  return createdStore
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']

export const useDispatch = () => useDispatchBase<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore = () => useStoreBase<AppStore>()
