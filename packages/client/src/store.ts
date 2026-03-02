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
import forumReducer, { ForumState } from './slices/forumSlice'

declare global {
  interface Window {
    APP_INITIAL_STATE: RootState
  }
}

const FORUM_STORAGE_KEY = 'forum_state_v1'

const loadForumState = (): ForumState | undefined => {
  try {
    const raw = localStorage.getItem(FORUM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ForumState) : undefined
  } catch {
    return undefined
  }
}

const saveForumState = (state: ForumState) => {
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
})

export const store = configureStore({
  reducer,
  preloadedState:
    typeof window === 'undefined'
      ? undefined
      : {
          ...window.APP_INITIAL_STATE,
          forum: loadForumState() ?? window.APP_INITIAL_STATE?.forum,
        },
})

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    saveForumState(store.getState().forum)
  })
}

export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch

export const useDispatch: () => AppDispatch = useDispatchBase
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore: () => typeof store = useStoreBase
