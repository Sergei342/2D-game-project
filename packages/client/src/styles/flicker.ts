import { keyframes } from 'styled-components'

export const flicker = keyframes`
  0%, 100% { opacity: 1; }
  45% { opacity: 0.85; }
  50% { opacity: 0.4; }
  55% { opacity: 0.9; }
`
