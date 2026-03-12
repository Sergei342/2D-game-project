import styled from 'styled-components'
import { blink } from '../../styles/blink'

export const Cursor = styled.span`
  margin-left: 2px;
  animation: ${blink} 1s steps(1) infinite;
`
