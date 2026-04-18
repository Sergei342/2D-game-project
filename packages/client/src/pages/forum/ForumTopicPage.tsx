import {
  Button,
  Card,
  // Form,
  // Input,
  // List,
  Modal,
  Space,
  Typography,
  // Avatar,
  Spin,
} from 'antd'
// import { UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetTopicQuery, useRemoveTopicMutation } from './Forum.api'
import { getAuthorName } from '@/shared/getAuthorName'

const { Title, Text } = Typography

// type CommentForm = { text: string }

export const initForumTopicPage = async () => null
export const ForumTopicPage = () => {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const [removeTopic] = useRemoveTopicMutation()

  const {
    data: topic,
    isLoading,
    error,
  } = useGetTopicQuery({ topicId: Number(topicId) })

  // const onAddComment = async (values: CommentForm) => {
  //   if (!topicId) return
  //   // const { name, avatar } = await getAuthorInfo()

  //   // TODO: добавить комментарий подключить api
  //   console.log('add comment', values);
  //   // dispatch(
  //   //   addComment({
  //   //     topicId,
  //   //     comment: {
  //   //       id: String(Date.now()),
  //   //       author: name,
  //   //       avatar,
  //   //       text: values.text.trim(),
  //   //       createdAt: formatDateTime(),
  //   //     },
  //   //   })
  //   // )
  // }

  const confirmDelete = () => {
    if (!topicId || !topic) return

    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${topic.title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => {
        removeTopic({ topicId: topic.id })
        navigate('/forum')
      },
    })
  }

  if (isLoading) {
    return <Spin description={'Загрузка страницы топика'} />
  }

  if (error) {
    return <div>Ошибка загрузки страницы топика</div>
  }

  if (!topic) {
    return (
      <Card>
        <Space orientation="vertical" size={12}>
          <Title level={4} style={{ margin: 0 }}>
            Топик не найден
          </Title>
          <Button onClick={() => navigate('/forum')}>К списку</Button>
        </Space>
      </Card>
    )
  }

  return (
    <Space orientation="vertical" style={{ width: '100%' }} size={16}>
      <Card>
        <Space orientation="vertical" style={{ width: '100%' }} size={6}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={3} style={{ margin: 0 }}>
              {topic.title}
            </Title>

            <Space>
              <Button onClick={() => navigate('/forum')}>К списку</Button>
              <Button danger onClick={confirmDelete}>
                Удалить
              </Button>
            </Space>
          </Space>

          <Text type="secondary">
            {getAuthorName(topic.author)} · {topic.createdAt}
          </Text>
          <Text>{topic.description}</Text>
        </Space>
      </Card>

      {/* TODO: добавить комментарии из api */}
      {/* <Card title={`Комментарии (${topic.commentsCount})`}>
        <List
          dataSource={[]}
          locale={{ emptyText: 'Комментариев пока нет' }}
          renderItem={c => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar size={28} src={c.avatar} icon={<UserOutlined />} />
                }
                title={
                  <Space>
                    <Text strong>{c.author}</Text>
                    <Text type="secondary">{c.createdAt}</Text>
                  </Space>
                }
                description={c.text}
              />
            </List.Item>
          )}
        />

        <Form<CommentForm>
          layout="vertical"
          onFinish={onAddComment}
          style={{ marginTop: 16 }}>
          <Form.Item
            label="Добавить комментарий"
            name="text"
            rules={[{ required: true, message: 'Введите текст комментария' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form>
      </Card> */}
    </Space>
  )
}
