import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Game, type GameEvent } from '../../../../game/engine/Game'
import { modalEvents } from './GamePage.constants'

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
  }, [canvasRef, handleGameEvent])

  const initGame = () => {
    setIsLoading(true)

    console.log({ gameRef: gameRef.current })

    gameRef.current?.init()
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
