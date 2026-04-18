import { Badge, Button, Card, List, Modal, Space, Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetTopicsQuery, useRemoveTopicMutation } from './Forum.api'
import { getAuthorName } from '@/shared/getAuthorName'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'

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
        dataSource={data?.data ?? []}
        locale={{ emptyText: 'Пока нет топиков' }}
        renderItem={item => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/forum/${item.id}`)}
            actions={
              item.authorId === user?.id
                ? [
                    <Button
                      onClick={e => {
                        e.stopPropagation()
                        //TODO: добавить api редактирования топика
                        console.log('edit topic')
                      }}>
                      Редактировать
                    </Button>,
                    <Button
                      danger
                      onClick={e => {
                        e.stopPropagation()
                        confirmDelete(item.id, item.title)
                      }}>
                      Удалить
                    </Button>,
                  ]
                : undefined
            }>
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
                    {getAuthorName(item.author)} · {item.createdAt}
                  </Text>
                  <Text type="secondary">
                    Комментарии: {item.commentsCount}
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
