import { Typography } from 'antd'
import styled from 'styled-components'

const { Title } = Typography

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
`

export const TitleStyled = styled(Title)`
  && {
    flex: 1;
    text-align: center;
  }
`

export const Topics = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 20px;
  padding: 0 8px;
  margin-top: 16px;
  max-height: calc(100vh - 164px);
  border-radius: 8px;
  overflow-y: auto;
`
