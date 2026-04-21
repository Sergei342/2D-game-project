import {
  Badge,
  Button,
  Card,
  Flex,
  Modal,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetTopicsQuery, useRemoveTopicMutation } from '../Forum.api'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import * as Styled from './ForumTopicsPage.styled'
import { cssVariables } from '@/styles/variables'
import { formatISODate, isUpdated } from '@/shared/date'
const { Title, Text } = Typography

export const ForumTopicsPage = () => {
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [removeTopic] = useRemoveTopicMutation()

  const { data, isLoading, error } = useGetTopicsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const confirmDelete = (topicId: number, title: string) => {
    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => removeTopic({ topicId }),
    })
  }

  if (isLoading) {
    return <Spin description={'Загрузка страницы форума'} />
  }

  if (error) {
    return <div>Ошибка загрузки страницы форума</div>
  }

  return (
    <Styled.Container>
      <Styled.PageHeader>
        <Title level={3} style={{ flex: 1, textAlign: 'center' }}>
          ФОРУМ
        </Title>
        <Button type="primary" onClick={() => navigate('/forum/new')}>
          Создать топик
        </Button>
      </Styled.PageHeader>

      <Flex
        vertical
        gap={20}
        style={{
          padding: '0 8px',
          marginTop: 16,
          borderRadius: 8,
        }}>
        {!data?.data?.length && <Text type="secondary">Пока нет топиков</Text>}

        {(data?.data ?? []).map(item => (
          <Card
            key={item.id}
            hoverable
            variant="borderless"
            onClick={() => navigate(`/forum/${item.id}`)}
            style={{
              minWidth: '50vw',
              backgroundColor: cssVariables.bgContainerLight,
              cursor: 'pointer',
            }}>
            <Flex justify="space-between" align="start" gap={20}>
              <Flex vertical gap={4}>
                <Space>
                  <Text strong>{item.title}</Text>
                  <Badge count={item.commentsCount} showZero />
                  {isUpdated(item.createdAt, item.updatedAt) && (
                    <Tooltip
                      title={`Изменено: ${formatISODate(item.updatedAt)}`}>
                      <Text type="secondary">(ред.)</Text>
                    </Tooltip>
                  )}
                </Space>

                <Text type="secondary">{item.description}</Text>

                <Text type="secondary">
                  <strong style={{ color: cssVariables.textColor }}>
                    {item.author.displayName}
                  </strong>{' '}
                  · {formatISODate(item.createdAt)}
                </Text>

                <Text type="secondary">Комментарии: {item.commentsCount}</Text>
              </Flex>

              {item.authorId === user?.id && (
                <Space>
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      navigate(`/forum/${item.id}/edit`)
                    }}>
                    Редактировать
                  </Button>

                  <Button
                    danger
                    onClick={e => {
                      e.stopPropagation()
                      confirmDelete(item.id, item.title)
                    }}>
                    Удалить
                  </Button>
                </Space>
              )}
            </Flex>
          </Card>
        ))}
      </Flex>
    </Styled.Container>
  )
}
