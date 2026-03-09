import React, { useEffect, useMemo, useRef } from 'react'
import { CANVAS_H, CANVAS_W } from '../game/engine/types'
import { Game, type GameEvent } from '../game/engine/Game'
import { usePage } from '../hooks/usePage'

type Props = {
  userId: string
  displayName?: string

  // можно подписаться и слать инфу в лидерборд
  onGameEvent?: (e: GameEvent) => void
}

export const GamePage = ({ userId, displayName, onGameEvent }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<Game | null>(null)

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

    let mounted = true
    ;(async () => {
      try {
        await game.init()
        if (!mounted) return
        game.run()
      } catch (err) {
        console.error('Game init failed', err)
      }
    })()

    return () => {
      mounted = false
      game.destroy()
      gameRef.current = null
    }
  }, [userId, displayName, onGameEvent])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const game = gameRef.current
    const canvas = canvasRef.current
    if (!game || !canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H

    game.handleUiClick(x, y)
  }

  usePage({ initPage: initGamePage })

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onClick={handleClick}
      style={{
        width: `${CANVAS_W}px`,
        height: `${CANVAS_H}px`,
        display: 'block',
        margin: '0 auto',
        background: '#000',
        userSelect: 'none',
      }}
    />
  )
}

export const initGamePage = () => Promise.resolve()
