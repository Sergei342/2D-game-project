import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Game, type GameEvent } from '@/game/engine/Game'
import { selectUser } from '@/slices/userSlice'
import { useDispatch, useSelector } from '@/store'
import { API_FIELD_RATING_FIELD_NAME } from '@/shared/constants'
import { useAddScoreMutation } from '@/pages/leaderboard/LeaderBoard.api'
import { message } from 'antd'
import { isLeaderBoardEvent, isModalEvent } from './GamePage.types'
import { updateGame } from '@/slices/gameSlice'
import { modalEvents } from './GamePage.constants'
import { useGameNotifications } from './useGameNotifications'

type UseGamePageDataProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export const useGamePageData = ({ canvasRef }: UseGamePageDataProps) => {
  const gameRef = useRef<Game | null>(null)

  const [modalType, setModalType] = useState<GameEvent['type']>('level')
  const [showModal, setShowModal] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const [addScore] = useAddScoreMutation()

  const handleGameEvent = useCallback(
    async (e: GameEvent) => {
      if (isModalEvent(e)) {
        setModalType(e.type)
        setShowModal(true)
        dispatch(updateGame({ score: e.score }))
      }

      if (isLeaderBoardEvent(e) && user) {
        try {
          await addScore({
            data: {
              id: user.id,
              login: user.login,
              [API_FIELD_RATING_FIELD_NAME]: e.score,
            },
          }).unwrap()

          message.success('Результат отправлен в таблицу лидеров')
        } catch (e) {
          message.error('Ошибка отправки результата')
        }
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
      identity: {
        userId: String(user?.id) ?? 'userId',
        displayName: user?.display_name ?? user?.login ?? 'displayName',
      },
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

  useGameNotifications(getSnapshot)

  const initGame = async () => {
    setIsLoading(true)

    await gameRef.current?.init()
    gameRef.current?.run()
  }

  const startNewGame = () => {
    setIsLoading(false)
    setShowModal(false)
    dispatch(updateGame({ score: 0, level: 1 }))
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
