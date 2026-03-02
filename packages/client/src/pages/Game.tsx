import React, { useEffect, useRef } from 'react'
import { CANVAS_H, CANVAS_W } from '../game/engine/types'
import { Game } from '../game/engine/Game'
import { usePage } from '../hooks/usePage'

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<Game | null>(null)

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
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
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
