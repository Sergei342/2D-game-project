import { Avatar, Button, Flex, Space, Tooltip, Typography } from 'antd'
import { BASE_URL } from '@/shared/constants'
import { UserOutlined } from '@ant-design/icons'
import { CommentDTO } from '../../../Forum.api'
import { memo, MutableRefObject } from 'react'
import { formatISODate, isUpdated } from '@/shared/date'
import * as Styled from './TopicComment.styled'
import { cssVariables } from '@/styles/variables'

type TopicCommentProps = {
  comment: CommentDTO
  activeReplyId: number | null
  flashId: number | null
  commentRefs: MutableRefObject<Record<number, HTMLDivElement | null>>
  onReply: (commentId: number) => void
  onEdit: (comment: CommentDTO) => void
  onDelete: (commentId: number) => void
  onAnimationEndFlashing: () => void
  currentUserId?: number
}

const { Text } = Typography

export const TopicComment = memo(
  ({
    comment,
    activeReplyId,
    flashId,
    currentUserId,
    commentRefs,
    onReply,
    onEdit,
    onDelete,
    onAnimationEndFlashing,
  }: TopicCommentProps) => {
    const isFlashing = comment.id === flashId
    const isActive = comment.id === activeReplyId
    const isAuthor =
      currentUserId !== undefined && comment.author.id === currentUserId

    return (
      <Styled.Wrapper
        ref={element => (commentRefs.current[comment.id] = element)}
        $isFlashing={isFlashing}
        $isActive={isActive}
        onAnimationEnd={() => {
          if (isFlashing) {
            onAnimationEndFlashing()
          }
        }}>
        <Flex gap={8}>
          <Avatar
            size={28}
            src={`${BASE_URL}/resources/${comment.author.avatar}`}
            icon={<UserOutlined />}
          />

          <Flex flex={1} gap={4} vertical>
            <Space size={6} wrap>
              <Text strong>{comment.author.displayName}</Text>
              <Text type="secondary">{formatISODate(comment.createdAt)}</Text>
              {isUpdated(comment.createdAt, comment.updatedAt) && (
                <Tooltip
                  title={`Изменено: ${formatISODate(comment.updatedAt)}`}>
                  <Text type="secondary">(ред.)</Text>
                </Tooltip>
              )}
              <Text type="secondary">{`#${comment.id}`}</Text>
            </Space>

            <div style={{ color: cssVariables.textColor }}>{comment.text}</div>

            <Space size={4}>
              {!isActive && currentUserId !== undefined && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => onReply(comment.id)}>
                  Ответить
                </Button>
              )}

              {isAuthor && (
                <>
                  <Button
                    type="link"
                    size="small"
                    disabled={isActive}
                    onClick={() => onEdit(comment)}>
                    Редактировать
                  </Button>

                  <Button
                    type="link"
                    size="small"
                    danger
                    disabled={isActive}
                    onClick={() => onDelete(comment.id)}>
                    Удалить
                  </Button>
                </>
              )}
            </Space>
          </Flex>
        </Flex>

        {comment.replies?.length > 0 && (
          <div style={{ marginLeft: 32 }}>
            {comment.replies.map(reply => (
              <TopicComment
                key={reply.id}
                commentRefs={commentRefs}
                comment={reply}
                activeReplyId={activeReplyId}
                flashId={flashId}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onAnimationEndFlashing={onAnimationEndFlashing}
              />
            ))}
          </div>
        )}
      </Styled.Wrapper>
    )
  }
)
