import React from 'react'
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  Space,
  Spin,
  Typography,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

import { usePage } from '@/hooks/usePage'
import { useSelector, type AppDispatch } from '@/store'
import { selectUser } from '@/slices/userSlice'
import {
  forumApi,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useGetTopicQuery,
  type CommentNodeDTO,
} from '@/api/forumApi'
import { CommentReactions } from './components/CommentReactions'
import { formatDateTime } from '@/shared/formatDateTime'
import { profileService } from '@/pages/profile/ProfileService'

const { Title, Text } = Typography

type CommentForm = { text: string }

export const initForumTopicPage = async ({
  params,
  dispatch,
}: {
  params?: { topicId?: string }
  dispatch: AppDispatch
}) => {
  const topicId = Number(params?.topicId)
  if (Number.isNaN(topicId)) return

  await Promise.all([
    dispatch(forumApi.endpoints.getTopic.initiate(topicId)),
    dispatch(forumApi.endpoints.getComments.initiate(topicId)),
  ])
}

interface CommentNodeProps {
  comment: CommentNodeDTO
  topicId: number
  currentUserId: number | null
  depth: number
}

const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  topicId,
  currentUserId,
  depth,
}) => {
  const authorName =
    comment.author?.displayName ?? `Пользователь #${comment.authorId}`

  const avatarSrc = comment.author?.avatar ?? undefined

  return (
    <>
      <List.Item
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingLeft: depth * 24,
          gap: 6,
        }}>
        <Space>
          <Avatar size={28} src={avatarSrc} icon={<UserOutlined />} />
          <Text strong>{authorName}</Text>
          <Text type="secondary">
            {formatDateTime(new Date(comment.createdAt))}
          </Text>
        </Space>

        <Text style={{ paddingLeft: 36 }}>{comment.text}</Text>

        <div style={{ paddingLeft: 36 }}>
          <CommentReactions
            commentId={comment.id}
            topicId={topicId}
            reactions={comment.reactions ?? []}
            currentUserId={currentUserId}
          />
        </div>
      </List.Item>

      {comment.replies.map(reply => (
        <CommentNode
          key={reply.id}
          comment={reply}
          topicId={topicId}
          currentUserId={currentUserId}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

export const ForumTopicPage = () => {
  usePage({ initPage: initForumTopicPage })

  const navigate = useNavigate()
  const { topicId: topicIdParam } = useParams<{ topicId: string }>()
  const topicId = Number(topicIdParam)

  const user = useSelector(selectUser)
  const currentUserId = user?.id ?? null

  const { data: topic, isLoading: isTopicLoading } = useGetTopicQuery(topicId, {
    skip: Number.isNaN(topicId),
  })

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetCommentsQuery(topicId, { skip: Number.isNaN(topicId) })

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation()
  const [form] = Form.useForm<CommentForm>()

  const isLoading = isTopicLoading || isCommentsLoading

  const onAddComment = async (values: CommentForm) => {
    if (!user || Number.isNaN(topicId)) return

    const displayName =
      user.display_name ||
      [user.first_name, user.second_name].filter(Boolean).join(' ') ||
      user.login

    const avatarUrl = profileService.avatarUrl(user.avatar)

    await createComment({
      topicId,
      text: values.text.trim(),
      authorId: user.id,
      displayName,
      avatar: avatarUrl,
    }).unwrap()

    form.resetFields()
  }

  if (Number.isNaN(topicId)) {
    return (
      <Card>
        <Space orientation="vertical">
          <Text type="danger">Некорректный ID топика</Text>
          <Button onClick={() => navigate('/forum')}>К списку</Button>
        </Space>
      </Card>
    )
  }

  if (isCommentsError) {
    return (
      <Card>
        <Space orientation="vertical">
          <Text type="danger">Не удалось загрузить комментарии</Text>
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
            <Button onClick={() => navigate('/forum')}>← К списку</Button>
          </Space>

          {isTopicLoading ? (
            <Spin />
          ) : topic ? (
            <>
              <Title level={3} style={{ margin: 0 }}>
                {topic.title}
              </Title>
              <Text type="secondary">
                {topic.author?.displayName ?? `Пользователь #${topic.authorId}`}{' '}
                · {formatDateTime(new Date(topic.createdAt))}
              </Text>
              <Text>{topic.description}</Text>
            </>
          ) : (
            <Text type="secondary">Топик #{topicId}</Text>
          )}
        </Space>
      </Card>

      <Card title={`Комментарии${comments ? ` (${comments.length})` : ''}`}>
        {isLoading ? (
          <Spin />
        ) : (
          <List
            dataSource={comments ?? []}
            locale={{ emptyText: 'Комментариев пока нет' }}
            renderItem={comment => (
              <CommentNode
                key={comment.id}
                comment={comment}
                topicId={topicId}
                currentUserId={currentUserId}
                depth={0}
              />
            )}
          />
        )}

        <Form<CommentForm>
          form={form}
          layout="vertical"
          onFinish={onAddComment}
          style={{ marginTop: 16 }}>
          <Form.Item
            label="Добавить комментарий"
            name="text"
            rules={[{ required: true, message: 'Введите текст комментария' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
            disabled={!user}>
            Отправить
          </Button>
        </Form>
      </Card>
    </Space>
  )
}
