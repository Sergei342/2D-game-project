import { Button, Card, Form, Input, Space, Typography, Spin, Flex } from 'antd'

import { TopicComment } from './components/TopicComment'
import { useForumTopicPageData } from './useForumTopicPageData'
import { cssVariables } from '@/styles/variables'
import { TopicHeader } from './components/TopicHeader'
import { FormModeInfo } from './components/FormModeInfo'

const { Title, Text } = Typography

export const ForumTopicPage = () => {
  const {
    user,
    isLoading,
    error,
    topic,
    commentsRef,
    textareaRef,
    isLoadingComments,
    isLoadingAddComment,
    isLoadingUpdateComment,
    comments,
    activeCommentId,
    form,
    formMode,
    confirmDeleteComment,
    onReplyComment,
    onEditComment,
    onSubmit,
    onCancelMode,
    goToForumTopicsPage,
  } = useForumTopicPageData()

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
          <Button onClick={goToForumTopicsPage}>К списку</Button>
        </Space>
      </Card>
    )
  }

  return (
    <Space orientation="vertical" style={{ width: '100%' }} size={16}>
      <TopicHeader topic={topic} />

      <Card
        title={`Комментарии (${comments?.length ?? 0})`}
        variant="borderless"
        style={{ backgroundColor: cssVariables.bgContainerLight }}>
        <div
          ref={commentsRef}
          style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: 16 }}>
          {isLoadingComments ? (
            <Spin />
          ) : !comments?.length ? (
            <Text type="secondary">Комментариев пока нет</Text>
          ) : (
            <Flex vertical gap={12} style={{ width: '100%' }}>
              {comments.map(c => (
                <TopicComment
                  key={c.id}
                  comment={c}
                  activeReplyId={activeCommentId}
                  currentUserId={user?.id ?? null}
                  onReply={onReplyComment}
                  onEdit={onEditComment}
                  onDelete={confirmDeleteComment}
                />
              ))}
            </Flex>
          )}
        </div>

        <FormModeInfo formMode={formMode} onCancelMode={onCancelMode} />

        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Добавить комментарий"
            name="text"
            rules={[{ required: true, message: 'Введите текст комментария' }]}>
            <Input.TextArea
              ref={textareaRef}
              rows={3}
              style={{ resize: 'none' }}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingAddComment || isLoadingUpdateComment}>
            {formMode.type === 'edit' ? 'Сохранить' : 'Отправить'}
          </Button>
        </Form>
      </Card>
    </Space>
  )
}
