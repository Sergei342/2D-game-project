import { Button, Card, Form, Input, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { usePage } from '@/hooks/usePage'
import { useDispatch } from '@/store'
import { addTopic } from '@/slices/forumSlice'
import { formatDateTime } from '@/shared/formatDateTime'
import { getAuthorInfo } from '@/shared/getAuthorInfo'

const { Title } = Typography

type FormValues = {
  title: string
  description: string
}

export const initForumCreateTopicPage = async () => null

export const ForumCreateTopicPage = () => {
  usePage({ initPage: initForumCreateTopicPage })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = async (values: FormValues) => {
    const { name } = await getAuthorInfo()

    dispatch(
      addTopic({
        id: String(Date.now()),
        title: values.title.trim(),
        description: values.description.trim(),
        author: name,
        createdAt: formatDateTime(),
      })
    )

    navigate('/forum')
  }

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Title level={3} style={{ margin: 0 }}>
          Создание топика
        </Title>

        <Form<FormValues> layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Заголовок"
            name="title"
            rules={[{ required: true, message: 'Введите заголовок' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: 'Введите описание' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <Button type="primary" htmlType="submit">
              Создать
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}
