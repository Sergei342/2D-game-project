import { flicker } from '@/styles/flicker'
import { glitch1, glitch2 } from '@/styles/glitch'
import { cssVariables } from '@/styles/variables'
import { Typography } from 'antd'
import styled from 'styled-components'

const { Title } = Typography

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px 32px;

  .ant-card-body {
    min-height: 20vh;
    background-color: ${cssVariables.bgContainerLight};
  }
`

export const Block = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  padding: 24px;
  background-color: ${cssVariables.bgContainerLight};
  border-radius: 28px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`

export const Glitch = styled(Title)`
  margin: 0;
  position: relative;
  font-size: 42px;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: ${flicker} 2.5s infinite;

  /* Красный слой */
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
  }

  /* 🔴 Красный сдвиг */
  &::before {
    left: 2px;
    text-shadow: -2px 0 red;
    animation: ${glitch1} 2s infinite linear alternate-reverse;
  }

  /* 🔵 Синий сдвиг */
  &::after {
    left: -2px;
    animation: ${glitch2} 1.5s infinite linear alternate-reverse;
  }
`
