import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  REACTION_TYPES,
  ReactionDTO,
  useAddReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} from '@/api/forumApi'

interface CommentReactionsProps {
  commentId: number
  topicId: number
  reactions: ReactionDTO[]
  currentUserId: number | null
}

/**
 * Отображает строку эмодзи-реакций для одного комментария.
 *
 * Логика клика:
 *  - пользователь ещё не ставил реакцию → POST (добавить)
 *  - кликнул по той же эмодзи, что уже стоит → DELETE (убрать)
 *  - кликнул по другой эмодзи → PUT (заменить)
 *
 * Показываются только эмодзи из REACTION_TYPES. Счётчик отображается
 * рядом с кнопкой, если у неё count > 0.
 */
export const CommentReactions: React.FC<CommentReactionsProps> = ({
  commentId,
  topicId,
  reactions,
  currentUserId,
}) => {
  const [addReaction, { isLoading: isAdding }] = useAddReactionMutation()
  const [updateReaction, { isLoading: isUpdating }] =
    useUpdateReactionMutation()
  const [deleteReaction, { isLoading: isDeleting }] =
    useDeleteReactionMutation()

  const isMutating = isAdding || isUpdating || isDeleting

  // Реакция текущего пользователя на этот комментарий (если есть)
  const userReaction: ReactionDTO | undefined = currentUserId
    ? reactions.find(r => r.userId === currentUserId)
    : undefined

  // Количество реакций каждого типа
  const countByType: Record<string, number> = {}
  for (const type of REACTION_TYPES) {
    countByType[type] = reactions.filter(r => r.type === type).length
  }

  const handleClick = (type: string) => {
    if (!currentUserId || isMutating) return

    if (!userReaction) {
      // Реакции нет → добавить
      addReaction({ commentId, type, userId: currentUserId, topicId })
    } else if (userReaction.type === type) {
      // Та же эмодзи → убрать
      deleteReaction({ commentId, userId: currentUserId, topicId })
    } else {
      // Другая эмодзи → заменить
      updateReaction({ commentId, type, userId: currentUserId, topicId })
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
              type={isActive ? 'primary' : 'text'}
              style={{ padding: '0 6px', fontSize: 16, minWidth: 36 }}
              disabled={!currentUserId || isMutating}
              onClick={() => handleClick(type)}>
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
