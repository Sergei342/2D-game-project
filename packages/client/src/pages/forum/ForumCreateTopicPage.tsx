import { Button, Card, Form, Input, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { usePage } from '@/hooks/usePage'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { useCreateTopicMutation } from '@/api/forumApi'
import { profileService } from '@/pages/profile/ProfileService'

const { Title } = Typography

type FormValues = {
  title: string
  description: string
}

export const initForumCreateTopicPage = async () => null

export const ForumCreateTopicPage = () => {
  usePage({ initPage: initForumCreateTopicPage })

  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [createTopic, { isLoading }] = useCreateTopicMutation()

  const onFinish = async (values: FormValues) => {
    if (!user) return

    const displayName =
      user.display_name ||
      [user.first_name, user.second_name].filter(Boolean).join(' ') ||
      user.login

    const avatarUrl = profileService.avatarUrl(user.avatar)

    await createTopic({
      title: values.title.trim(),
      description: values.description.trim(),
      authorId: user.id,
      displayName,
      avatar: avatarUrl,
    }).unwrap()

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
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!user}>
              Создать
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}
