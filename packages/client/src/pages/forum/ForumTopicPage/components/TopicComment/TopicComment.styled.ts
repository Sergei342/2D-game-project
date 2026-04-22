import { flash } from '@/styles/flash'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div<{ $isActive: boolean; $isFlashing: boolean }>`
  padding: ${({ $isActive }) =>
    $isActive ? '8px 8px 28px 8px' : '8px 8px 0 8px'};
  border-radius: 8px;
  background-color: ${({ $isActive }) =>
    $isActive ? '#2e558d' : 'transparent'};
  transition: background-color 0.3s ease;

  ${({ $isFlashing }) =>
    $isFlashing &&
    css`
      animation: ${flash} 1.5s ease-in-out 0.5s;
    `}
`
