import { Modal, Button, Typography, Space, Spin, Flex } from 'antd'
import { HomeOutlined, RocketOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { PHRASES } from './GameStart.constants'
import { cssVariables } from '../../../../styles/variables'
import { KeyCap } from '../../../../components/KeyCap'
import { useTypewriter } from '../../../../hooks/useTypewriter'
import { Cursor } from '../../../../components/Cursor'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

type GameStartProps = {
  open: boolean
  onFinish: () => void
}

export const GameStart = ({ open, onFinish }: GameStartProps) => {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)

  const text =
    'Управляй кораблём, уничтожай захватчиков и не дай им добраться до Земли'
  const typedText = useTypewriter(text)

  useEffect(() => {
    if (!started) {
      return
    }

    if (step < PHRASES.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1)
      }, 1000)

      return () => clearTimeout(timer)
    }

    const finishTimer = setTimeout(() => {
      onFinish()
    }, 800)

    return () => clearTimeout(finishTimer)
  }, [started, step])

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
        },
        body: {
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cssVariables.bgColor,
        },
      }}>
      {!started ? (
        <Space orientation="vertical" align="center" size="large">
          <Title style={{ marginBottom: 0 }}>👾 SPACE INVADERS</Title>

          <Paragraph
            style={{ maxWidth: 420, minHeight: 32, textAlign: 'center' }}>
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

          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => setStarted(true)}>
            Поехали
          </Button>

          <Button
            type="text"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}>
            На Главную
          </Button>
        </Space>
      ) : (
        <Space
          orientation="vertical"
          align="center"
          size="large"
          color={cssVariables.secondaryColor}>
          <Spin size="large" />

          <Title
            level={4}
            style={{ color: cssVariables.secondaryColor, marginTop: 16 }}>
            {PHRASES[Math.min(step, PHRASES.length - 1)]}
          </Title>
        </Space>
      )}
    </Modal>
  )
}
