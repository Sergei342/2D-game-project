import { keyframes } from 'styled-components'

export const glitch1 = keyframes`
  0% { clip-path: inset(0 0 90% 0); }
  20% { clip-path: inset(10% 0 60% 0); }
  40% { clip-path: inset(40% 0 40% 0); }
  60% { clip-path: inset(60% 0 20% 0); }
  80% { clip-path: inset(80% 0 5% 0); }
  100% { clip-path: inset(0 0 90% 0); }
`

export const glitch2 = keyframes`
  0% { clip-path: inset(80% 0 5% 0); }
  20% { clip-path: inset(60% 0 20% 0); }
  40% { clip-path: inset(30% 0 50% 0); }
  60% { clip-path: inset(10% 0 70% 0); }
  80% { clip-path: inset(50% 0 30% 0); }
  100% { clip-path: inset(80% 0 5% 0); }
`
