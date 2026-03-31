import { keyframes } from 'styled-components'
import { cssVariables } from './variables'

export const glow = keyframes`
  0% {
    text-shadow: 0 0 5px ${cssVariables.primaryColor};
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px ${cssVariables.primaryColor};
    transform: scale(1.01);
  }
  100% {
    text-shadow: 0 0 5px ${cssVariables.primaryColor};
    transform: scale(1);
  }
`
