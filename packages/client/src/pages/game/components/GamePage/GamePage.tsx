import { MouseEvent, useEffect, useRef, useState } from 'react'
import { CANVAS_H, CANVAS_W } from '@/@/game/engine/types'
import { Game, type GameEvent } from '@/@/game/engine/Game'
import { usePage } from '@/@/hooks/usePage'
import { GameStart } from '@/GameStart'
import { useFullscreen } from '@/@/hooks/useFullscreen'

// TODO: userId и displayName забирать из стора Redux, удаоить из пропсов компонента
type GamePageProps = {
  userId: string
  displayName?: string

  // можно подписаться и слать инфу в лидерборд
  onGameEvent?: (e: GameEvent) => void
}

export const GamePage = ({
  userId,
  displayName,
  onGameEvent,
}: GamePageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const gameRef = useRef<Game | null>(null)
  const [showModal, setShowModal] = useState(true)

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  const handleStart = () => {
    setShowModal(false)

    if (gameRef.current) {
      gameRef.current.init()
      gameRef.current.run()
    }
  }

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const game = gameRef.current
    const canvas = canvasRef.current
    if (!game || !canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H
    game.handleUiClick(x, y)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = new Game(ctx, {
      identity: { userId, displayName },
      callbacks: { onEvent: onGameEvent },
    })

    gameRef.current = game

    return () => {
      game.destroy()
      gameRef.current = null
    }
  }, [userId, displayName, onGameEvent])

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
        background: isFullscreen ? '#000' : undefined,
      }}>
      <GameStart open={showModal} onStart={handleStart} />

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={handleClick}
        style={{
          width: `${CANVAS_W}px`,
          height: `${CANVAS_H}px`,
          display: 'block',
          background: '#000',
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
