import { PropsWithChildren } from 'react'
import * as Styled from './KeyCap.styled'

type KeyCapProps = {
  wide?: boolean
}

export const KeyCap = ({ children, wide }: PropsWithChildren<KeyCapProps>) => {
  return <Styled.Container $wide={wide}>{children}</Styled.Container>
}
