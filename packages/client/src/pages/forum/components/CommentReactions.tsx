import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  REACTION_TYPES,
  type ReactionDTO,
  useAddReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} from '@/api/forumApi'

interface CommentReactionsProps {
  commentId: number
  topicId: number
  reactions?: ReactionDTO[]
  currentUserId: number | null
}

export const CommentReactions: React.FC<CommentReactionsProps> = ({
  commentId,
  topicId,
  reactions = [],
  currentUserId,
}) => {
  const [addReaction, { isLoading: isAdding }] = useAddReactionMutation()
  const [updateReaction, { isLoading: isUpdating }] =
    useUpdateReactionMutation()
  const [deleteReaction, { isLoading: isDeleting }] =
    useDeleteReactionMutation()

  const isMutating = isAdding || isUpdating || isDeleting

  const userReaction = currentUserId
    ? reactions.find(r => r.userId === currentUserId)
    : undefined

  const countByType: Record<string, number> = {}
  for (const type of REACTION_TYPES) {
    countByType[type] = reactions.filter(r => r.type === type).length
  }

  const handleClick = async (type: string) => {
    if (!currentUserId || isMutating) return

    if (!userReaction) {
      await addReaction({
        commentId,
        type,
        userId: currentUserId,
        topicId,
      }).unwrap()
    } else if (userReaction.type === type) {
      await deleteReaction({
        commentId,
        userId: currentUserId,
        topicId,
      }).unwrap()
    } else {
      await updateReaction({
        commentId,
        type,
        userId: currentUserId,
        topicId,
      }).unwrap()
    }
  }

  return (
    <Space size={4} wrap>
      {REACTION_TYPES.map(type => {
        const count = countByType[type]
        const isActive = userReaction?.type === type

        return (
          <Tooltip
            key={type}
            title={
              currentUserId ? undefined : 'Войдите, чтобы поставить реакцию'
            }>
            <Button
              size="small"
              type={isActive ? 'primary' : 'default'}
              style={{ padding: '0 8px', fontSize: 16, minWidth: 44 }}
              disabled={!currentUserId || isMutating}
              onClick={() => void handleClick(type)}>
              {type}
              {count > 0 ? (
                <span style={{ marginLeft: 4, fontSize: 12 }}>{count}</span>
              ) : null}
            </Button>
          </Tooltip>
        )
      })}
    </Space>
  )
}
