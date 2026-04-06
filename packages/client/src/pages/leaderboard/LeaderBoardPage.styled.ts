import { glow } from '@/styles/glow'
import { cssVariables } from '@/styles/variables'
import { Typography, Table } from 'antd'
import styled from 'styled-components'

const { Title } = Typography

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 100vh;
  padding: 10vh 20px;
  color: ${cssVariables.primaryColor};
`

export const TitleStyled = styled(Title)`
  && {
    margin-bottom: 40px;
    color: ${cssVariables.primaryColor};
    font-size: 22px;
    line-height: 1.25;
    text-shadow: 0 0 10px ${cssVariables.primaryColor},
      0 0 20px ${cssVariables.primaryColor};
    animation: ${glow} 2s infinite;
  }
`

export const StyledTable = styled(Table)`
  width: 600px;
  background-color: transparent;

  .ant-table {
    background-color: transparent;
    color: ${cssVariables.primaryColor};
  }

  .ant-table-thead > tr > th {
    background-color: transparent;
    color: ${cssVariables.primaryColor};
    border-bottom: 1px solid ${cssVariables.primaryColor};
    text-shadow: 0 0 5px ${cssVariables.primaryColor};
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${cssVariables.labelColor};

    &:first-child {
      text-align: center;
    }
  }

  .ant-table-tbody > tr:hover:not(.current-user) > td {
    background-color: ${cssVariables.bgColor} !important;
  }

  .ant-table-tbody > tr.current-user > td {
    color: ${cssVariables.bgColor};
    background-color: ${cssVariables.secondaryColor};
  }

  .ant-table-tbody > tr.current-user:hover > td {
    background-color: ${cssVariables.secondaryColor} !important;
  }
`

export const RankFirst = styled.span`
  font-size: 22px;
  text-shadow: 0 0 6px gold, 0 0 12px orange, 0 0 20px yellow;
`

export const RankSecond = styled.span`
  font-size: 20px;
  text-shadow: 0 0 6px silver, 0 0 12px gray, 0 0 20px #c4c4c4;
`
export const RankThird = styled.span`
  font-size: 18px;
  text-shadow: 0 0 6px #cd7f32, 0 0 12px #a97142, 0 0 20px #665d1e;
`
