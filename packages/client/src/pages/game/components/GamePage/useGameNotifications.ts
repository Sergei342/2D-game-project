import { useEffect, useRef } from 'react'
import { useNotification } from '@/hooks/useNotification'
import type { Game } from '@/game/engine/Game'

const AWAY_DELAY_MS = 3000
const REMINDER_DELAY_MS = 60000

let tagCounter = 0

export const useGameNotifications = (
  getSnapshot: () => ReturnType<Game['getSnapshot']> | null
) => {
  const { show } = useNotification()

  const getSnapshotRef = useRef(getSnapshot)
  useEffect(() => {
    getSnapshotRef.current = getSnapshot
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    let alertId: ReturnType<typeof setTimeout> | null = null
    let reminderId: ReturnType<typeof setTimeout> | null = null

    const clearTimers = () => {
      if (alertId) {
        clearTimeout(alertId)
        alertId = null
      }
      if (reminderId) {
        clearTimeout(reminderId)
        reminderId = null
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const snap = getSnapshotRef.current()
        if (snap?.state !== 'playing') return

        const sessionTag = ++tagCounter

        alertId = setTimeout(() => {
          const current = getSnapshotRef.current()
          if (current?.state === 'playing') {
            show('Вы под обстрелом!', {
              body: `Ваш корабль под огнём. Жизней: ${current.lives}`,
              tag: `game-alert-${sessionTag}`,
            })
          }
        }, AWAY_DELAY_MS)

        reminderId = setTimeout(() => {
          const current = getSnapshotRef.current()
          if (current?.state === 'playing') {
            show('Вы отсутствуете минуту', {
              body: 'Корабль всё ещё под обстрелом! Нажмите, чтобы вернуться.',
              tag: `game-reminder-${sessionTag}`,
            })
          }
        }, REMINDER_DELAY_MS)
      } else {
        clearTimers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimers()
    }
  }, [show])
}
