import { Button, Card } from 'antd'
import styled from 'styled-components'

export const PageRoot = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px 32px;
`

export const HeroCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f4f8ff 0%, #e8efff 100%);
  border: 1px solid #c9d6ff;

  .ant-card-body {
    min-height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .ant-typography {
    color: #0f172a;
  }

  .ant-typography-secondary {
    color: #334155;
  }
`

export const StartButton = styled(Button)`
  && {
    align-self: center;
    min-width: 220px;
    height: 52px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 999px;
    margin-top: 8px;
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #1e40af;
    border-color: #1e40af;
    color: #ffffff;
  }
`

export const MainMenu = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 10px 0;
`

export const MainMenuButton = styled(Button)`
  && {
    min-width: 170px;
    height: 42px;
    border-radius: 10px;
    font-weight: 600;
    color: #1f2937;
    border-color: #94a3b8;
    background: #ffffff;
  }

  &&:hover,
  &&:focus {
    color: #0f172a;
    border-color: #475569;
    background: #f8fafc;
  }
`
