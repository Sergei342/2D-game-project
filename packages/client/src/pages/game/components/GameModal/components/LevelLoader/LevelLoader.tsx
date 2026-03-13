import { Space, Spin, Typography } from 'antd'
import { cssVariables } from '../../../../../../styles/variables'
import { useEffect, useState } from 'react'
import { LOADING_PHRASES } from './LevelLoader.constants'

type LevelLoaderProps = {
  onAction: () => void
}

export const LevelLoader = ({ onAction }: LevelLoaderProps) => {
  const { Title } = Typography

  const [step, setStep] = useState(0)
  const phrase = LOADING_PHRASES[step]

  useEffect(() => {
    if (step < LOADING_PHRASES.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1)
      }, 1000)

      return () => clearTimeout(timer)
    }

    const finishTimer = setTimeout(onAction, 1000)

    return () => clearTimeout(finishTimer)
  }, [step, onAction])

  return (
    <Space
      orientation="vertical"
      align="center"
      size="large"
      color={cssVariables.secondaryColor}>
      <Spin size="large" />

      <Title
        level={4}
        style={{ color: cssVariables.secondaryColor, marginTop: 16 }}>
        {phrase}
      </Title>
    </Space>
  )
}
