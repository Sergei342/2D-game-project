import { Space, Spin, Typography } from 'antd'
import { cssVariables } from '@/styles/variables'
import { useEffect, useRef, useState } from 'react'
import { LOADING_PHRASES, LOADING_DELAY } from './LevelLoader.constants'

type LevelLoaderProps = {
  onAction: () => void
}

export const LevelLoader = ({ onAction }: LevelLoaderProps) => {
  const { Title } = Typography

  const [step, setStep] = useState(0)
  const phrase = LOADING_PHRASES[step]

  const actionRef = useRef(onAction)

  useEffect(() => {
    actionRef.current = onAction
  }, [onAction])

  useEffect(() => {
    // if (step < LOADING_PHRASES.length - 1) {
    //   const timer = setTimeout(() => {
    //     setStep(prev => prev + 1)
    //   }, LOADING_DELAY)

    //   return () => clearTimeout(timer)
    // }

    // const finishTimer = setTimeout(onAction, LOADING_DELAY)

    const timer = setTimeout(() => {
      const next = step + 1

      if (next < LOADING_PHRASES.length) {
        setStep(next)
      } else {
        actionRef.current()
      }
    }, LOADING_DELAY)

    return () => clearTimeout(timer)
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
