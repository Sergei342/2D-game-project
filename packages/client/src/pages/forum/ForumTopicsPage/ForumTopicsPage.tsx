import {
  Badge,
  Button,
  Card,
  Flex,
  message,
  Modal,
  Pagination,
  Result,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  forumApi,
  PAGE_SIZE_DEFAULT,
  useGetTopicsQuery,
  useRemoveTopicMutation,
} from '../Forum.api'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'
import * as Styled from './ForumTopicsPage.styled'
import { cssVariables } from '@/styles/variables'
import { formatISODate, isUpdated } from '@/shared/date'
import { useState } from 'react'
import { PageInitArgs } from '@/types'
const { Title, Text } = Typography

export const initForumTopicsPage = async ({ dispatch }: PageInitArgs) => {
  return dispatch(
    forumApi.endpoints.getTopics.initiate({
      page: 1,
      pageSize: PAGE_SIZE_DEFAULT,
    })
  )
}

export const ForumTopicsPage = () => {
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [page, setPage] = useState(1)

  const [removeTopic] = useRemoveTopicMutation()

  const {
    data,
    isLoading,
    error,
    refetch: refetchGetTopics,
  } = useGetTopicsQuery({ page, pageSize: PAGE_SIZE_DEFAULT })

  const confirmDelete = (topicId: number, title: string) => {
    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${title}» будет удалён вместе с комментариями.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeTopic({ topicId }).unwrap()
          message.success(`Топик "${title}" успешно удален`)
        } catch {
          message.error(`При удалении топика "${title}" произошла ошибка`)
        }
      },
    })
  }

  if (isLoading) {
    return <Spin description={'Загрузка страницы форума'} />
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Не удалось загрузить список топиков"
        subTitle="Проверьте соединение или попробуйте снова"
        extra={
          <Space>
            <Button type="primary" onClick={refetchGetTopics}>
              Повторить
            </Button>
          </Space>
        }
      />
    )
  }

  return (
    <Styled.Container>
      <Styled.PageHeader>
        <Title level={3} style={{ flex: 1, textAlign: 'center' }}>
          ФОРУМ
        </Title>
        <Button type="primary" onClick={() => navigate('/forum/new')}>
          Создать топик
        </Button>
      </Styled.PageHeader>

      <Styled.Topics>
        {!data?.items?.length && (
          <Result
            status="info"
            title="Пока нет топиков"
            subTitle="Создайте первый топик"
            extra={
              <Button type="primary" onClick={() => navigate('/forum/new')}>
                Создать топик
              </Button>
            }
          />
        )}

        {(data?.items ?? []).map(item => (
          <Card
            key={item.id}
            hoverable
            variant="borderless"
            onClick={() => navigate(`/forum/${item.id}`)}
            style={{
              minWidth: '50vw',
              backgroundColor: cssVariables.bgContainerLight,
              cursor: 'pointer',
            }}>
            <Flex justify="space-between" align="start" gap={20}>
              <Flex vertical gap={4}>
                <Space>
                  <Text strong>{item.title}</Text>
                  <Badge count={item.commentsCount} showZero />
                  {isUpdated(item.createdAt, item.updatedAt) && (
                    <Tooltip
                      title={`Изменено: ${formatISODate(item.updatedAt)}`}>
                      <Text type="secondary">(ред.)</Text>
                    </Tooltip>
                  )}
                </Space>

                <Text type="secondary">{item.description}</Text>

                <Text type="secondary">
                  <strong style={{ color: cssVariables.textColor }}>
                    {item.author.displayName}
                  </strong>{' '}
                  · {formatISODate(item.createdAt)}
                </Text>
              </Flex>

              {item.authorId === user?.id && (
                <Space>
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      navigate(`/forum/${item.id}/edit`)
                    }}>
                    Редактировать
                  </Button>

                  <Button
                    danger
                    onClick={e => {
                      e.stopPropagation()
                      confirmDelete(item.id, item.title)
                    }}>
                    Удалить
                  </Button>
                </Space>
              )}
            </Flex>
          </Card>
        ))}
      </Styled.Topics>

      {data && data.total > data.size && (
        <Pagination
          style={{ marginTop: 16, textAlign: 'center' }}
          current={data.page}
          pageSize={data.size}
          total={data.total}
          onChange={newPage => setPage(newPage)}
        />
      )}
    </Styled.Container>
  )
}
