import { Modal } from 'antd'
import { cssVariables } from '@/styles/variables'
import { ModalContent } from './components/ModalContent'
import {
  GAME_COMPLETE_TEXT,
  GAME_COMPLETE_TITLE,
  GAME_OVER_TEXT,
  GAME_OVER_TITLE,
  GAME_START_TEXT,
  GAME_START_TITLE,
  LEVEL_COMPLETE_TEXT,
} from './GameModal.constants'
import { GameEvent } from '@/game/engine/Game'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSelector } from '@/store'
import { selectLevel } from '@/slices/gameSlice'

type GameModalProps = {
  container: HTMLElement | null
  isLoading: boolean
  open: boolean
  type: GameEvent['type']
  onInitGame: () => Promise<void>
  onLoadLevel: () => void
  onStartNewGame: () => void
  onContinueGame: () => void
  onRestartGame: () => void
}

export const GameModal = ({
  container,
  isLoading,
  open,
  type,
  onInitGame,
  onLoadLevel,
  onStartNewGame,
  onContinueGame,
  onRestartGame,
}: GameModalProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const level = useSelector(selectLevel)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const content = useMemo(() => {
    const modalContentCommonProps = { isLoading }

    let modalContent: ReactNode

    switch (type) {
      case 'levelComplete':
        modalContent = (
          <ModalContent
            {...modalContentCommonProps}
            title={`Уровень ${level}`}
            description={LEVEL_COMPLETE_TEXT}
            submitButton={{ title: 'Продолжить', onSubmit: onLoadLevel }}
            onAction={onContinueGame}
          />
        )
        break

      case 'win':
        modalContent = (
          <ModalContent
            {...modalContentCommonProps}
            title={GAME_COMPLETE_TITLE}
            description={GAME_COMPLETE_TEXT}
            submitButton={{ title: 'Начать заново', onSubmit: onRestartGame }}
            onAction={onStartNewGame}
          />
        )
        break

      case 'gameover':
        modalContent = (
          <ModalContent
            {...modalContentCommonProps}
            title={GAME_OVER_TITLE}
            description={GAME_OVER_TEXT}
            submitButton={{ title: 'Начать заново', onSubmit: onRestartGame }}
            onAction={onStartNewGame}
            danger
          />
        )
        break

      case 'level':
      default:
        modalContent = (
          <ModalContent
            {...modalContentCommonProps}
            title={GAME_START_TITLE}
            description={GAME_START_TEXT}
            submitButton={{ title: 'Поехали', onSubmit: onInitGame }}
            onAction={onStartNewGame}
          />
        )
        break
    }

    return modalContent
  }, [
    isLoading,
    level,
    onContinueGame,
    onInitGame,
    onLoadLevel,
    onRestartGame,
    onStartNewGame,
    type,
  ])

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width="100%"
      styles={{
        container: {
          padding: 0,
          backgroundColor: cssVariables.bgOpacityColor,
          backgroundImage: isLoading ? 'none' : `url('/images/space-bg.png')`,
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        },
        body: {
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        },
      }}
      getContainer={container ?? false}>
      {content}
    </Modal>
  )
}
