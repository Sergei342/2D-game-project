import { useEffect } from 'react'
import { useNotification } from '@/hooks/useNotification'
import type { Game } from '@/game/engine/Game'

const AWAY_DELAY_MS = 3000
const REMINDER_DELAY_MS = 60000

export const useGameNotifications = (
  getSnapshot: () => ReturnType<Game['getSnapshot']> | null
) => {
  const { show } = useNotification()

  useEffect(() => {
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
        const snap = getSnapshot()
        if (snap?.state !== 'playing') return

        alertId = setTimeout(() => {
          const current = getSnapshot()
          if (current?.state === 'playing') {
            show('Вы под обстрелом!', {
              body: `Ваш корабль под огнём. Жизней: ${current.lives}`,
              tag: 'game-alert',
            })
          }
        }, AWAY_DELAY_MS)

        reminderId = setTimeout(() => {
          const current = getSnapshot()
          if (current?.state === 'playing') {
            show('Вы отсутствуете минуту', {
              body: 'Корабль всё ещё под обстрелом! Нажмите, чтобы вернуться.',
              tag: 'game-reminder',
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
  }, [getSnapshot, show])
}
