import { useRef, useEffect } from 'react'
import { CANVAS_H, CANVAS_W } from '@/game/engine/types'
import { usePage } from '@/hooks/usePage'
import { GameModal } from '@/pages/game/components/GameModal'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useGamePageData } from '@/pages/game/components/GamePage/useGamePageData'
import { useNotification } from '@/hooks/useNotification'

const AWAY_DELAY_MS = 3000
const REMINDER_DELAY_MS = 60000

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { show: showNotification } = useNotification()

  const {
    isLoading,
    showModal,
    modalType,
    initGame,
    startNewGame,
    restartGame,
    continueGame,
    loadLevel,
    getSnapshot,
  } = useGamePageData({ canvasRef })

  const getSnapshotRef = useRef(getSnapshot)
  getSnapshotRef.current = getSnapshot

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
        const snap = getSnapshotRef.current()
        if (snap?.state !== 'playing') return

        alertId = setTimeout(() => {
          const current = getSnapshotRef.current()
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
  }, [])

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  usePage({ initPage: initGamePage })

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: isFullscreen ? '100%' : `${CANVAS_W}px`,
        height: isFullscreen ? '100%' : undefined,
        margin: '0 auto',
        display: isFullscreen ? 'flex' : undefined,
        alignItems: isFullscreen ? 'center' : undefined,
        justifyContent: isFullscreen ? 'center' : undefined,
        background: isFullscreen
          ? `url('/images/space-bg.png') center top / cover no-repeat`
          : 'initial',
      }}>
      <GameModal
        container={containerRef.current}
        open={showModal}
        type={modalType}
        isLoading={isLoading}
        onInitGame={initGame}
        onLoadLevel={loadLevel}
        onStartNewGame={startNewGame}
        onContinueGame={continueGame}
        onRestartGame={restartGame}
      />

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          width: `${CANVAS_W}px`,
          height: `${CANVAS_H}px`,
          display: 'block',
          background: '#000000',
          userSelect: 'none',
        }}
      />

      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            right: 4,
            bottom: 4,
            width: 28,
            height: 28,
            padding: 0,
            border: 'none',
            background: '#00ff9c',
            cursor: 'pointer',
            color: '#1b1950',
            zIndex: 10,
          }}
          title="Полноэкранный режим">
          ⛶
        </button>
      )}
    </div>
  )
}

export const initGamePage = () => Promise.resolve()
