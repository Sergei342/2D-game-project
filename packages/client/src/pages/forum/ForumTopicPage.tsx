import {
  Button,
  Card,
  Form,
  Input,
  List,
  Modal,
  Space,
  Typography,
  Avatar,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

import { usePage } from '@/hooks/usePage'
import { useDispatch, useSelector } from '@/store'
import { addComment, deleteTopic, selectTopicById } from '@/slices/forumSlice'
import { formatDateTime } from '@/shared/formatDateTime'
import { getAuthorInfo } from '@/shared/getAuthorInfo'

const { Title, Text } = Typography

type CommentForm = { text: string }

export const initForumTopicPage = async () => null
export const ForumTopicPage = () => {
  usePage({ initPage: initForumTopicPage })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { topicId } = useParams()

  const topic = useSelector(selectTopicById(topicId || ''))

  const onAddComment = async (values: CommentForm) => {
    if (!topicId) return
    const { name, avatar } = await getAuthorInfo()

    dispatch(
      addComment({
        topicId,
        comment: {
          id: String(Date.now()),
          author: name,
          avatar,
          text: values.text.trim(),
          createdAt: formatDateTime(),
        },
      })
    )
  }

  const confirmDelete = () => {
    if (!topicId || !topic) return

    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${topic.title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteTopic({ topicId }))
        navigate('/forum')
      },
    })
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
            {topic.author} · {topic.createdAt}
          </Text>
          <Text>{topic.description}</Text>
        </Space>
      </Card>

      <Card title={`Комментарии (${topic.comments.length})`}>
        <List
          dataSource={topic.comments}
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
      </Card>
    </Space>
  )
}
