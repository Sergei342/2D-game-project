import { Space, Typography } from 'antd'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes/types'
import { fetchUserThunk, selectUser } from '../slices/userSlice'
import { useSelector } from '../store'
import {
  HeroCard,
  MainMenu,
  MainMenuButton,
  PageRoot,
  StartButton,
} from './Main.styles'

const { Title, Paragraph, Text } = Typography

type QuickLink = {
  key: string
  title: string
  path: string
}

const quickLinks: QuickLink[] = [
  {
    key: 'forum',
    title: 'Форум',
    path: '/friends',
  },
  {
    key: 'leaderboard',
    title: 'Лидерборд',
    path: '/404',
  },
  {
    key: 'profile',
    title: 'Профиль',
    path: '/profile',
  },
]

export const MainPage = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  usePage({ initPage: initMainPage })

  return (
    <PageRoot>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="description"
          content="Главная страница с описанием игры и переходом по разделам"
        />
      </Helmet>

      <Header />

      <HeroCard bordered={false}>
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <Title level={2}>Space Invaders</Title>
          <Paragraph>
            Управляйте кораблем, уворачивайтесь от снарядов, поднимайтесь в
            рейтинге и оттачивайте свой стиль игры.
          </Paragraph>
          {user ? (
            <Text strong>
              С возвращением, {user.name} {user.secondName}
            </Text>
          ) : (
            <Text type="secondary">Профиль игрока пока не загружен.</Text>
          )}
          <StartButton
            type="primary"
            size="large"
            onClick={() => navigate('/game')}>
            Начать игру
          </StartButton>
        </Space>
      </HeroCard>

      <MainMenu>
        {quickLinks.map(link => (
          <MainMenuButton
            key={link.key}
            type="default"
            onClick={() => navigate(link.path)}>
            {link.title}
          </MainMenuButton>
        ))}
      </MainMenu>
    </PageRoot>
  )
}

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
