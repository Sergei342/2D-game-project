import { Badge, Button, Card, List, Modal, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { usePage } from '@/hooks/usePage'
import { useDispatch, useSelector } from '@/store'
import { deleteTopic, selectTopics } from '@/slices/forumSlice'

const { Title, Text } = Typography

export const initForumTopicsPage = async () => null

export const ForumTopicsPage = () => {
  usePage({ initPage: initForumTopicsPage })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const topics = useSelector(selectTopics)

  const confirmDelete = (topicId: string, title: string) => {
    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => dispatch(deleteTopic({ topicId })),
    })
  }

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: 0 }}>
          Форум — все топики
        </Title>
        <Button type="primary" onClick={() => navigate('/forum/new')}>
          Создать топик
        </Button>
      </Space>

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
                  <Badge count={item.comments.length} showZero />
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{item.description}</Text>
                  <Text type="secondary">
                    {item.author} · {item.createdAt}
                  </Text>
                  <Text type="secondary">
                    Комментарии: {item.comments.length}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
