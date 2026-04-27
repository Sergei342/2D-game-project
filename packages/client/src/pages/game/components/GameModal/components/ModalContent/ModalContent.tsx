import { useNavigate } from 'react-router-dom'
import { LevelLoader } from '@/pages/game/components/GameModal/components/LevelLoader'
import { Button, Flex, Space, Typography } from 'antd'
import { useTypewriter } from '@/hooks/useTypewriter'
import { Cursor } from '@/components/Cursor'
import { KeyCap } from '@/components/KeyCap'
import { HomeOutlined, RocketOutlined } from '@ant-design/icons'
import { cssVariables } from '@/styles/variables'
import { useSelector } from '@/store'
import { selectScore } from '@/slices/gameSlice'

type ModalSubmitButton = {
  title: string
  onSubmit: () => void | Promise<void>
}

type ModalContentProps = {
  title: string
  description: string
  submitButton: ModalSubmitButton
  isLoading: boolean
  onAction: () => void
  danger?: boolean
}

export const ModalContent = ({
  isLoading,
  title,
  description,
  submitButton,
  danger,
  onAction,
}: ModalContentProps) => {
  const navigate = useNavigate()

  const { title: submitButtonTitle, onSubmit } = submitButton

  const { value: typedText, done } = useTypewriter({
    text: description,
    enabled: !isLoading,
  })

  const { Paragraph, Title } = Typography
  const score = useSelector(selectScore)

  if (isLoading) {
    return <LevelLoader onAction={onAction} />
  }

  return (
    <Space orientation="vertical" align="center" size="large">
      <Title
        level={3}
        style={{
          marginBottom: 0,
          color: danger ? cssVariables.errorColor : cssVariables.primaryColor,
          fontSize: 28,
        }}>
        👾 {title}
      </Title>

      <Paragraph
        style={{
          maxWidth: 450,
          minHeight: 130,
          fontSize: 20,
          lineHeight: 1.5,
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}>
        {typedText}
        <Cursor />
      </Paragraph>

      <Space orientation="vertical" size="small">
        <Flex align="center" gap={10}>
          <Flex>
            <KeyCap>←</KeyCap>
            <KeyCap>→</KeyCap>
          </Flex>
          Перемещение
        </Flex>

        <Flex align="center" gap={10}>
          <KeyCap wide>⎵ SPACE</KeyCap>
          Огонь
        </Flex>
      </Space>

      <Paragraph
        style={{
          maxWidth: 450,
          minHeight: 130,
          fontSize: 20,
          lineHeight: 1.5,
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}>
        Счет: {score}
      </Paragraph>

      <Button
        type="primary"
        size="large"
        icon={<RocketOutlined />}
        style={{ opacity: done ? 1 : 0 }}
        disabled={!done}
        danger={danger}
        onClick={onSubmit}>
        {submitButtonTitle}
      </Button>

      <Button
        type="text"
        size="large"
        icon={<HomeOutlined />}
        onClick={() => navigate('/')}>
        На Главную
      </Button>
    </Space>
  )
}
