import { useState } from 'react'
import * as Styled from './LeaderBoardPage.styled'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { Button, Spin } from 'antd'
import { API_FILED_RATING_FIELD_NAME } from '@/shared/constants'
import { PageInitArgs } from '@/routes/types'
import { leaderBoardApi, useGetLeaderBoardQuery } from './LeaderBoard.api'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

type Leader = {
  id: number
  name: string
  score: number
}

export const LeaderBoardPage = () => {
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetLeaderBoardQuery()
  const [sortOrder, setSortOrder] = useState<string | null>(null)

  const user = useSelector(selectUser)

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

  const leaders =
    data?.map(({ data }) => ({
      id: data.id,
      name: data.login,
      score: data[API_FILED_RATING_FIELD_NAME],
    })) ?? []

  if (isLoading) {
    return <Spin description={'Загрузка таблицы лидеров'} />
  }

  if (error) {
    return <div>Ошибка загрузки таблицы лидеров</div>
  }

  return (
    <Styled.Wrapper>
      <Styled.TitleStyled>🏆 ТАБЛИЦА ЛИДЕРОВ</Styled.TitleStyled>

      <Styled.StyledTable
        dataSource={leaders}
        columns={columns}
        pagination={false}
        rowKey="id"
        rowClassName={(record: Leader) =>
          record.id === user?.id ? 'current-user' : ''
        }
        onChange={(_, __, sorter) => {
          if (!Array.isArray(sorter)) {
            setSortOrder(sorter.order ?? null)
          }
        }}
      />

      <Button
        type="text"
        size="large"
        icon={<HomeOutlined />}
        onClick={() => navigate('/')}>
        На Главную
      </Button>
    </Styled.Wrapper>
  )
}

export const initLeaderBoardPage = async ({ dispatch }: PageInitArgs) => {
  dispatch(leaderBoardApi.endpoints.getLeaderBoard.initiate())
}
