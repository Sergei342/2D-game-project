import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Game, type GameEvent } from '@/game/engine/Game'
import { useNotification } from '@/hooks/useNotification'
import { modalEvents } from './GamePage.constants'

const AWAY_DELAY_MS = 3000
const REMINDER_DELAY_MS = 60000

type UseGamePageDataProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export const useGamePageData = ({ canvasRef }: UseGamePageDataProps) => {
  const gameRef = useRef<Game | null>(null)

  const [modalType, setModalType] = useState<GameEvent['type']>('level')
  const [showModal, setShowModal] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleGameEvent = useCallback((e: GameEvent) => {
    if (modalEvents.includes(e.type)) {
      setModalType(e.type)
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = new Game(ctx, {
      // TODO: забрать юзера из стора
      identity: { userId: 'userId', displayName: 'displayName' },
      callbacks: { onEvent: handleGameEvent },
    })

    gameRef.current = game

    return () => {
      game.destroy()
      gameRef.current = null
    }
  }, [handleGameEvent])

  const getSnapshot = useCallback(() => {
    return gameRef.current?.getSnapshot() ?? null
  }, [])

  const { show: showNotification } = useNotification()
  const showNotificationRef = useRef(showNotification)
  showNotificationRef.current = showNotification

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
            showNotificationRef.current('Вы под обстрелом!', {
              body: `Ваш корабль под огнём. Жизней: ${current.lives}`,
              tag: 'game-alert',
            })
          }
        }, AWAY_DELAY_MS)

        reminderId = setTimeout(() => {
          showNotificationRef.current('Вы отсутствуете минуту', {
            body: 'Корабль всё ещё под обстрелом! Нажмите, чтобы вернуться.',
            tag: 'game-reminder',
          })
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
  }, [getSnapshot])

  const initGame = async () => {
    setIsLoading(true)

    await gameRef.current?.init()
    gameRef.current?.run()
  }

  const startNewGame = () => {
    setIsLoading(false)
    setShowModal(false)
    gameRef.current?.startNewGame()
  }

  const continueGame = () => {
    setIsLoading(false)
    setShowModal(false)
    gameRef.current?.continueNextLevel()
  }

  const restartGame = () => {
    setIsLoading(true)
    gameRef.current?.restartToStartScreen()
  }

  const loadLevel = () => {
    setIsLoading(true)
  }

  return {
    modalType,
    showModal,
    isLoading,
    initGame,
    startNewGame,
    continueGame,
    restartGame,
    loadLevel,
  }
}
