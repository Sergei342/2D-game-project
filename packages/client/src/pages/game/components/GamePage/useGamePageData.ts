import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Game, type GameEvent } from '@/game/engine/Game'
import { leaderBoardEvents, modalEvents } from './GamePage.constants'
import { selectUser } from '@/slices/userSlice'
import { useSelector } from '@/store'
import { API_FILED_RATING_FIELD_NAME } from '@/shared/constants'
import { useAddScoreMutation } from '@/pages/leaderboard/LeaderBoard.api'

type UseGamePageDataProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

type LeaderBoardEvent = Extract<
  GameEvent,
  { type: 'score' | 'gameover' | 'win' | 'levelComplete' }
>

const isLeaderBoardEvent = (e: GameEvent): e is LeaderBoardEvent => {
  return leaderBoardEvents.includes(e.type)
}

export const useGamePageData = ({ canvasRef }: UseGamePageDataProps) => {
  const gameRef = useRef<Game | null>(null)

  const [modalType, setModalType] = useState<GameEvent['type']>('level')
  const [showModal, setShowModal] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(selectUser)

  const [addScore] = useAddScoreMutation()

  const handleGameEvent = useCallback(
    (e: GameEvent) => {
      if (modalEvents.includes(e.type)) {
        setModalType(e.type)
        setShowModal(true)
      }

      if (isLeaderBoardEvent(e) && user) {
        addScore({
          data: {
            ...user,
            [API_FILED_RATING_FIELD_NAME]: e.score,
          },
        })
      }
    },
    [user, addScore]
  )

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
