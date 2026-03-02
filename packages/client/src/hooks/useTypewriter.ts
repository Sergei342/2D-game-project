import { useEffect, useState } from 'react'

export const useTypewriter = (text: string, speed = 40) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (value.length >= text.length) return

    const timeout = setTimeout(() => {
      setValue(text.slice(0, value.length + 1))
    }, speed)

    return () => clearTimeout(timeout)
  }, [value, text, speed])

  return value
}
