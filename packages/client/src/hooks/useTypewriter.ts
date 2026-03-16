import { useEffect, useState } from 'react'

const SPEED_MIN = 40
const SPEED_MAX = 200

type UseTypewriterProps = {
  text: string
  speed?: number
  enabled?: boolean
}

export const useTypewriter = ({
  text,
  speed = SPEED_MIN,
  enabled = true,
}: UseTypewriterProps) => {
  const [value, setValue] = useState('')

  const delay = Math.min(Math.max(speed, SPEED_MIN), SPEED_MAX)
  const done = value.length >= text.length

  useEffect(() => {
    if (!enabled) {
      return
    }

    setValue('')
  }, [text, enabled])

  useEffect(() => {
    if (!enabled || done) {
      return
    }

    const timeout = setTimeout(() => {
      setValue(prev => text.slice(0, prev.length + 1))
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, text, delay, enabled])

  return {
    value,
    done,
  }
}
