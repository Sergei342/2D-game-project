import { useState } from 'react'
import * as Styled from './LeaderBoardPage.styled'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { Button, Spin, Typography } from 'antd'
import { PageInitArgs } from '@/types'
import { leaderBoardApi, useGetLeaderBoardQuery } from './LeaderBoard.api'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { SortOrder } from 'antd/es/table/interface'
import { TrophyOutlined } from '@ant-design/icons'

type Leader = {
  id: number
  name: string
  score: number
}

const { Title } = Typography

export const LeaderBoardPage = () => {
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetLeaderBoardQuery(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

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
      score: data.c58SITScore,
    })) ?? []

  if (isLoading) {
    return <Spin description={'Загрузка таблицы лидеров'} />
  }

  if (error) {
    return <div>Ошибка загрузки таблицы лидеров</div>
  }

  return (
    <Styled.Wrapper>
      <Title level={3}>
        <TrophyOutlined /> ТАБЛИЦА ЛИДЕРОВ
      </Title>

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
          } else {
            setSortOrder(null)
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

export const initLeaderBoardPage = ({ dispatch }: PageInitArgs) => {
  return dispatch(leaderBoardApi.endpoints.getLeaderBoard.initiate(undefined))
}
