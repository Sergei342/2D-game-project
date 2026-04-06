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
import { ReactNode } from 'react'
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
  let content: ReactNode
  const modalContentCommonProps = { isLoading }

  const level = useSelector(selectLevel)

  switch (type) {
    case 'levelComplete':
      content = (
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
      content = (
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
      content = (
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
      content = (
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
