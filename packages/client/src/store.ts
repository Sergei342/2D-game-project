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
import forumReducer from './slices/forumSlice'
import { api } from './api/baseApi'
import { forumApi } from './api/forumApi'
import { apiErrorMiddleware } from './api/apiErrorMiddleware'
import {
  createNoopForumStateStorage,
  type ForumStateStorage,
} from './store/forumStateStorage'

export const reducer = combineReducers({
  friends: friendsReducer,
  ssr: ssrReducer,
  user: userReducer,
  forum: forumReducer,
  game: gameReducer,
  [api.reducerPath]: api.reducer,
  [forumApi.reducerPath]: forumApi.reducer,
})

export type RootState = ReturnType<typeof reducer>

type CreateAppStoreOptions = {
  preloadedState?: RootState
  forumStateStorage?: ForumStateStorage
}

const resolvePreloadedState = (
  preloadedState: RootState | undefined,
  forumStateStorage: ForumStateStorage
): RootState | undefined => {
  if (!preloadedState) {
    return undefined
  }

  return {
    ...preloadedState,
    forum: forumStateStorage.load() ?? preloadedState.forum,
  }
}

export const createAppStore = ({
  preloadedState,
  forumStateStorage = createNoopForumStateStorage(),
}: CreateAppStoreOptions = {}) => {
  const createdStore = configureStore({
    reducer,
    preloadedState: resolvePreloadedState(preloadedState, forumStateStorage),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        api.middleware,
        forumApi.middleware,
        apiErrorMiddleware
      ),
  })

  createdStore.subscribe(() => {
    forumStateStorage.save(createdStore.getState().forum)
  })

  return createdStore
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']

export const useDispatch = () => useDispatchBase<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore = () => useStoreBase() as AppStore
