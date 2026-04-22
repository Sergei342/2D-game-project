import { cssVariables } from '@/styles/variables'
import { Button, Card, message, Modal, Space, Typography } from 'antd'
import * as Styled from './TopicHeader.styled'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopicDTO, useRemoveTopicMutation } from '@/pages/forum/Forum.api'
import { formatISODate } from '@/shared/date'

type TopicHeaderProps = {
  topic: TopicDTO
}

const { Title, Text } = Typography

export const TopicHeader = ({ topic }: TopicHeaderProps) => {
  const navigate = useNavigate()
  const [removeTopic] = useRemoveTopicMutation()

  const goToForumTopicsPage = useCallback(() => {
    navigate('/forum')
  }, [navigate])

  const { id, title, description, author, createdAt } = topic

  const confirmDeleteTopic = useCallback(() => {
    if (!id) {
      return
    }

    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${title}» будет удалён вместе с комментариями`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeTopic({ topicId: id }).unwrap()
          navigate('/forum')
        } catch {
          message.error('При удалении топика произошла ошибка')
        }
      },
    })
  }, [removeTopic, navigate])

  return (
    <Card
      variant="borderless"
      style={{ backgroundColor: cssVariables.bgContainerLight }}>
      <Styled.Container>
        <Styled.Header>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>

          <Space>
            <Button onClick={goToForumTopicsPage}>К списку</Button>
            <Button danger onClick={confirmDeleteTopic}>
              Удалить
            </Button>
          </Space>
        </Styled.Header>

        <Text type="secondary">
          {author.displayName} · {formatISODate(createdAt)}
        </Text>
        <Text>{description}</Text>
      </Styled.Container>
    </Card>
  )
}
