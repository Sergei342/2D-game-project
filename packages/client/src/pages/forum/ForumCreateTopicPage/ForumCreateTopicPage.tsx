import { Button, Form, Input, InputRef, message, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useAddTopicMutation } from '../Forum.api'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { getAuthorName } from '@/shared/getAuthorName'
import { useEffect, useRef } from 'react'

const { Title } = Typography

type FormValues = {
  title: string
  description: string
}

export const ForumCreateTopicPage = () => {
  const navigate = useNavigate()

  const user = useSelector(selectUser)
  const inputRef = useRef<InputRef | null>(null)

  const [addTopic, { isLoading: isCreating }] = useAddTopicMutation()

  const onFinish = async ({ title, description }: FormValues) => {
    if (!user) {
      return
    }

    try {
      await addTopic({
        title: title.trim(),
        description: description.trim(),
        authorId: user.id,
        displayName: getAuthorName(user),
        avatar: user.avatar,
      })

      message.success(`Топик "${title}" успешно создан`)
      navigate('/forum')
    } catch {
      message.error('Ошибка при создании топика')
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <section style={{ padding: '24px' }}>
      <Space orientation="vertical" style={{ width: '100%' }} size={16}>
        <Title level={3} style={{ margin: 0 }}>
          Создание топика
        </Title>

        <Form<FormValues> layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Заголовок"
            name="title"
            rules={[{ required: true, message: 'Введите заголовок' }]}>
            <Input ref={inputRef} />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: 'Введите описание' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Создать
            </Button>
          </Space>
        </Form>
      </Space>
    </section>
  )
}
