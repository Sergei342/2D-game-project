import { Badge, Button, Card, List, Modal, Space, Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { usePage } from '@/hooks/usePage'
import { useSelector, type AppDispatch } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { formatDateTime } from '@/shared/formatDateTime'
import {
  forumApi,
  useDeleteTopicMutation,
  useGetTopicsQuery,
} from '@/api/forumApi'

const { Title, Text } = Typography

export const initForumTopicsPage = async ({
  dispatch,
}: {
  dispatch: AppDispatch
}) => {
  await dispatch(forumApi.endpoints.getTopics.initiate())
}

export const ForumTopicsPage = () => {
  usePage({ initPage: initForumTopicsPage })

  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const { data, isLoading } = useGetTopicsQuery()
  const [deleteTopic] = useDeleteTopicMutation()

  const topics = data?.data ?? []

  const confirmDelete = (topicId: number, title: string) => {
    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteTopic(topicId).unwrap()
      },
    })
  }

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: 0 }}>
          Форум — все топики
        </Title>
        <Button
          type="primary"
          onClick={() => navigate('/forum/new')}
          disabled={!user}>
          Создать топик
        </Button>
      </Space>

      {isLoading ? (
        <Spin style={{ marginTop: 24, display: 'block' }} />
      ) : (
        <List
          style={{ marginTop: 16 }}
          dataSource={topics}
          locale={{ emptyText: 'Пока нет топиков' }}
          renderItem={item => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/forum/${item.id}`)}
              actions={[
                <Button
                  key="delete"
                  danger
                  onClick={e => {
                    e.stopPropagation()
                    confirmDelete(item.id, item.title)
                  }}>
                  Удалить
                </Button>,
              ]}>
              <List.Item.Meta
                title={
                  <Space>
                    <span>{item.title}</span>
                    <Badge count={item.commentsCount} showZero />
                  </Space>
                }
                description={
                  <Space orientation="vertical" size={0}>
                    <Text type="secondary">{item.description}</Text>
                    <Text type="secondary">
                      {item.author?.displayName ??
                        `Пользователь #${item.authorId}`}{' '}
                      · {formatDateTime(new Date(item.createdAt))}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
