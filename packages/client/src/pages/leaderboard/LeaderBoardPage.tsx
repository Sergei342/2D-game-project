import { useState } from 'react'
import * as Styled from './LeaderBoardPage.styled'

type Leader = {
  id: string
  name: string
  score: number
}

const mockData: Leader[] = [
  { id: '1', name: 'PlayerOne', score: 3200 },
  { id: '2', name: 'AlienHunter', score: 2800 },
  { id: '3', name: 'SpaceAce', score: 2500 },
  { id: '4', name: 'User', score: 1500 },
  { id: '5', name: 'Ivan', score: 700 },
  { id: '6', name: 'Pushkin', score: 600 },
  { id: '7', name: 'Foo', score: 500 },
  { id: '8', name: 'Bar', score: 400 },
  { id: '9', name: 'Baz', score: 300 },
  { id: '10', name: 'Ship', score: 200 },
]

const currentUserId = '6'

export const LeaderBoardPage = () => {
  const [sortOrder, setSortOrder] = useState<string | null>(null)

  const columns = [
    {
      title: '#',
      render: (_: unknown, __: Leader, index: number) => {
        if (sortOrder) {
          return index + 1
        }
        switch (index) {
          case 0:
            return <Styled.RankFirst>🥇</Styled.RankFirst>
          case 1:
            return <Styled.RankSecond>🥈</Styled.RankSecond>
          case 2:
            return <Styled.RankThird>🥉</Styled.RankThird>
          default:
            return index + 1
        }
      },
      width: 60,
    },
    {
      title: 'Игрок',
      dataIndex: 'name',
    },
    {
      title: 'Счет',
      dataIndex: 'score',
      sorter: (a: Leader, b: Leader) => b.score - a.score,
    },
  ]

  return (
    <Styled.Wrapper>
      <Styled.TitleStyled>🏆 ТАБЛИЦА ЛИДЕРОВ</Styled.TitleStyled>

      <Styled.StyledTable
        dataSource={mockData}
        columns={columns}
        pagination={false}
        rowKey="id"
        rowClassName={(record: Leader) =>
          record.id === currentUserId ? 'current-user' : ''
        }
        onChange={(_, __, sorter) => {
          if (!Array.isArray(sorter)) {
            setSortOrder(sorter.order ?? null)
          }
        }}
      />
    </Styled.Wrapper>
  )
}
