import styled from 'styled-components'
import { cssVariables } from '../../styles/variables'

export const Container = styled.span<{ $wide?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $wide }) => ($wide ? '80px' : '36px')};
  height: 36px;
  padding: 0 10px;
  margin: 0 4px;
  border-radius: 6px;
  border: 1px solid ${cssVariables.borderColor};
  color: ${cssVariables.textColor};
  font-size: 14px;
  user-select: none;
`
