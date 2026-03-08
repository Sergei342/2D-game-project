import React, { useEffect, useRef } from 'react'
import { CANVAS_H, CANVAS_W } from '../game/engine/types'
import { Game } from '../game/engine/Game'
import { usePage } from '../hooks/usePage'
import { useFullscreen } from '../hooks/useFullscreen'

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Game | null>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = new Game(ctx)
    gameRef.current = game

    let mounted = true

    ;(async () => {
      await game.init()
      if (!mounted) return
      game.run()
    })()

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W
      const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H
      game.handleCanvasClick(x, y)
    }

    canvas.addEventListener('click', onClick)

    return () => {
      mounted = false
      canvas.removeEventListener('click', onClick)
      game.destroy()
      gameRef.current = null
    }
  }, [])

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
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
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
            left: 4,
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
