import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  Spin,
  Flex,
  Result,
} from 'antd'

import { TopicComment } from './components/TopicComment'
import { useForumTopicPageData } from './useForumTopicPageData'
import { cssVariables } from '@/styles/variables'
import { TopicHeader } from './components/TopicHeader'
import { FormModeInfo } from './components/FormModeInfo'
import * as Styled from './ForumTopicPage.styled'

const { Title, Text } = Typography

export const ForumTopicPage = () => {
  const {
    user,
    isLoading,
    error,
    topic,
    commentsRef,
    commentRefs,
    textareaRef,
    isLoadingComments,
    isSubmitting,
    isSubmitDisabled,
    comments,
    commentsError,
    activeCommentId,
    flashCommentId,
    form,
    formMode,
    refetchGetTopic,
    refetchGetComments,
    confirmDeleteComment,
    onReplyComment,
    onEditComment,
    onSubmit,
    onCancelMode,
    goToForumTopicsPage,
    onAnimationEndFlashing,
  } = useForumTopicPageData()

  if (isLoading) {
    return <Spin description={'Загрузка страницы топика'} />
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Не удалось загрузить топик"
        subTitle="Проверьте соединение или попробуйте снова"
        extra={
          <Space>
            <Button type="primary" onClick={refetchGetTopic}>
              Повторить
            </Button>
            <Button onClick={goToForumTopicsPage}>К списку топиков</Button>
          </Space>
        }
      />
    )
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
    <Styled.Container>
      <TopicHeader topic={topic} />

      <Card
        title={`Комментарии (${comments?.length ?? 0})`}
        variant="borderless"
        style={{ backgroundColor: cssVariables.bgContainerLight }}>
        <Styled.Comments ref={commentsRef}>
          {isLoadingComments ? (
            <Spin description={'Загрузка комментариев топика'} />
          ) : commentsError ? (
            <Result
              status="warning"
              title="Не удалось загрузить комментарии"
              subTitle="Попробуйте снова"
              extra={<Button onClick={refetchGetComments}>Повторить</Button>}
            />
          ) : !comments?.length ? (
            <Text type="secondary">Комментариев пока нет</Text>
          ) : (
            <Flex vertical gap={12} style={{ width: '100%' }}>
              {comments.map(c => (
                <TopicComment
                  key={c.id}
                  commentRefs={commentRefs}
                  comment={c}
                  activeReplyId={activeCommentId}
                  flashId={flashCommentId}
                  currentUserId={user?.id}
                  onReply={onReplyComment}
                  onEdit={onEditComment}
                  onDelete={confirmDeleteComment}
                  onAnimationEndFlashing={onAnimationEndFlashing}
                />
              ))}
            </Flex>
          )}
        </Styled.Comments>

        <FormModeInfo formMode={formMode} onCancelMode={onCancelMode} />

        {!!user && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            disabled={isSubmitting}>
            <Form.Item
              label="Добавить комментарий"
              name="text"
              rules={[
                { required: true, message: 'Введите текст комментария' },
              ]}>
              <Input.TextArea
                ref={textareaRef}
                rows={3}
                style={{ resize: 'none' }}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitDisabled}>
              {formMode.type === 'edit' ? 'Сохранить' : 'Отправить'}
            </Button>
          </Form>
        )}
      </Card>
    </Styled.Container>
  )
}
