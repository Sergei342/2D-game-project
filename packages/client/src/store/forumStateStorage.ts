import type { ForumState } from '@/slices/forumSlice'
import { isServer } from '@/utils/runtime'

const FORUM_STORAGE_KEY = 'forum_state_v1'

export interface ForumStateStorage {
  load(): ForumState | undefined
  save(state: ForumState): void
}

const isForumState = (value: unknown): value is ForumState => {
  return typeof value === 'object' && value !== null
}

export const createNoopForumStateStorage = (): ForumStateStorage => ({
  load: () => undefined,
  save: () => undefined,
})

export const createLocalForumStateStorage = (
  storage: Storage
): ForumStateStorage => ({
  load: () => {
    try {
      const raw = storage.getItem(FORUM_STORAGE_KEY)

      if (!raw) {
        return undefined
      }

      const parsed: unknown = JSON.parse(raw)

      return isForumState(parsed) ? parsed : undefined
    } catch (error) {
      console.error(
        'Не удалось прочитать состояние форума из localStorage',
        error
      )
      return undefined
    }
  },

  save: (state: ForumState) => {
    try {
      storage.setItem(FORUM_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error(
        'Не удалось сохранить состояние форума в localStorage',
        error
      )
    }
  },
})

export const createBrowserForumStateStorage = (): ForumStateStorage => {
  if (isServer()) {
    return createNoopForumStateStorage()
  }

  return createLocalForumStateStorage(window.localStorage)
}
