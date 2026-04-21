import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetTopicQuery, useUpdateTopicMutation } from '../Forum.api'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import { useEffect } from 'react'

const { Title } = Typography

type FormValues = {
  title: string
  description: string
}

export const ForumEditTopicPage = () => {
  const navigate = useNavigate()
  const { topicId } = useParams()

  const user = useSelector(selectUser)
  const [form] = Form.useForm<FormValues>()

  const { data: topic, isLoading } = useGetTopicQuery({
    topicId: Number(topicId),
  })

  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation()

  const onFinish = async ({ title, description }: FormValues) => {
    if (!user) {
      return
    }

    try {
      await updateTopic({
        id: Number(topicId),
        title: title.trim(),
        description: description.trim(),
      }).unwrap()

      message.success(`Топик "${title}" успешно обновлен`)
      navigate('/forum')
    } catch {
      message.error('Ошибка при обновлении топика')
    }
  }

  useEffect(() => {
    if (topic) {
      form.setFieldsValue({
        title: topic.title ?? '',
        description: topic.description ?? '',
      })
    }
  }, [topic, form.setFieldsValue])

  if (isLoading) {
    return <Spin description={'Загрузка данных топика'} />
  }

  return (
    <Card variant="borderless">
      <Space orientation="vertical" style={{ width: '100%' }} size={16}>
        <Title level={3} style={{ margin: 0 }}>
          Редактирование топика
        </Title>

        <Form<FormValues> form={form} layout="vertical" onFinish={onFinish}>
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Сохранить
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}
