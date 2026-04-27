import { Button, Card, Col, Row, Typography } from 'antd'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { selectUser } from '../../slices/userSlice'
import { useSelector } from '../../store'

import * as Styled from './MainPage.styled'

const { Title, Paragraph, Text } = Typography

export const MainPage = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  return (
    <Styled.PageRoot>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="description"
          content="Главная страница с описанием игры и переходом по разделам"
        />
      </Helmet>

      <Styled.Block>
        <Title level={3}>👾 SPACE INVADERS</Title>
        {user ? (
          <Text>
            С возвращением, <strong>{user.first_name}</strong>!
          </Text>
        ) : (
          <Text>Они уже здесь. Сможешь ли ты выстоять?</Text>
        )}

        <Styled.Actions>
          <Button type="primary" size="large" onClick={() => navigate('/game')}>
            Играть
          </Button>
          <Button
            type="link"
            size="large"
            onClick={() => navigate('/leaderboard')}>
            Таблица лидеров
          </Button>
        </Styled.Actions>
      </Styled.Block>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Styled.Glitch level={4} data-text={'Геймплей'}>
              Геймплей
            </Styled.Glitch>
            <Text>
              Уклоняйся, стреляй и уничтожай волны врагов. Чем дольше живёшь —
              тем сложнее становится.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Styled.Glitch level={4} data-text={'Комьюнити'}>
              Комьюнити
            </Styled.Glitch>
            <Paragraph>
              Делись рекордами, обсуждай стратегии и соревнуйся с другими
              игроками.
            </Paragraph>

            <Button type="link" onClick={() => navigate('/forum')}>
              Перейти на форум →
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Styled.Glitch level={4} data-text={'Лидеры'}>
              Лидеры
            </Styled.Glitch>
            <Text>
              Лучшие игроки уже в таблице. Попробуй обойти их и занять первое
              место.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Styled.Glitch level={4} data-text={'Ретро'}>
              Ретро
            </Styled.Glitch>
            <Text>
              Легендарная аркада возвращается. Минимализм, скорость и чистый
              скилл.
            </Text>
          </Card>
        </Col>
      </Row>
    </Styled.PageRoot>
  )
}

export const initMainPage = () => Promise.resolve()
