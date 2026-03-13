import { Modal } from 'antd'
import { cssVariables } from '../../../../styles/variables'
import { ModalContent } from './components/ModalContent'
import {
  GAME_COMPLETE_TEXT,
  GAME_OVER_TEXT,
  GAME_START_TEXT,
  LEVEL_COMPLETE_TEXT,
} from './GameModal.constants'
import { GameEvent } from '../../../../game/engine/Game'

type GameModalProps = {
  container: HTMLElement | null
  isLoading: boolean
  open: boolean
  type: GameEvent['type']
  onInitGame: () => void
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
  const renderContent = () => {
    switch (type) {
      case 'level':
        return (
          <ModalContent
            isLoading={isLoading}
            title={'SPACE INVADERS'}
            description={GAME_START_TEXT}
            submitButton={{ title: 'Поехали', onSubmit: onInitGame }}
            onAction={onStartNewGame}
          />
        )
      case 'levelComplete':
        return (
          <ModalContent
            isLoading={isLoading}
            title={'Уровень 2'} // TODO: подключить стор
            description={LEVEL_COMPLETE_TEXT}
            submitButton={{ title: 'Продолжить', onSubmit: onLoadLevel }}
            onAction={onContinueGame}
          />
        )
      case 'win':
        return (
          <ModalContent
            isLoading={isLoading}
            title={'Вы выиграли!'}
            description={GAME_COMPLETE_TEXT}
            submitButton={{ title: 'Начать заново', onSubmit: onRestartGame }}
            onAction={onStartNewGame}
          />
        )
      case 'gameover':
        return (
          <ModalContent
            isLoading={isLoading}
            title={'Вы проиграли!'}
            description={GAME_OVER_TEXT}
            submitButton={{ title: 'Начать заново', onSubmit: onRestartGame }}
            onAction={onStartNewGame}
            danger
          />
        )
    }
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
      {renderContent()}
    </Modal>
  )
}
