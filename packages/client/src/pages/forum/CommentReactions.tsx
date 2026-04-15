import { useState } from 'react'
import { Button, Popover, Tooltip } from 'antd'
import styled from 'styled-components'

import { useDispatch, useSelector } from '@/store'
import { addReaction, removeReaction } from '@/slices/forumSlice'
import { selectUser } from '@/slices/userSlice'
import type { ForumComment, ForumReaction } from '@/slices/forumSlice'

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '👎'] as const

type ReactionGroup = {
  emoji: string
  count: number
  userReactionId: string | null
}

const groupReactions = (
  reactions: ForumReaction[] | undefined,
  userId: number | null
): ReactionGroup[] => {
  const map = new Map<string, ReactionGroup>()

  for (const reaction of reactions ?? []) {
    const entry = map.get(reaction.emoji)
    const isOwn = userId !== null && reaction.userId === userId

    if (entry) {
      entry.count += 1
      if (isOwn) {
        entry.userReactionId = reaction.id
      }
    } else {
      map.set(reaction.emoji, {
        emoji: reaction.emoji,
        count: 1,
        userReactionId: isOwn ? reaction.id : null,
      })
    }
  }

  return Array.from(map.values())
}

type Props = {
  topicId: string
  comment: ForumComment
}

export const CommentReactions = ({ topicId, comment }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [pickerOpen, setPickerOpen] = useState(false)

  const groups = groupReactions(comment.reactions, user?.id ?? null)

  const handleToggle = (group: ReactionGroup) => {
    if (!user) return

    if (group.userReactionId !== null) {
      dispatch(
        removeReaction({
          topicId,
          commentId: comment.id,
          reactionId: group.userReactionId,
        })
      )
      return
    }

    dispatch(
      addReaction({
        topicId,
        commentId: comment.id,
        reaction: {
          id: `${user.id}-${comment.id}-${group.emoji}-${Date.now()}`,
          emoji: group.emoji,
          userId: user.id,
          commentId: comment.id,
        },
      })
    )
  }

  const handlePickerSelect = (emoji: string) => {
    setPickerOpen(false)

    if (!user) return

    const existing = groups.find(group => group.emoji === emoji)

    if (existing && existing.userReactionId !== null) {
      dispatch(
        removeReaction({
          topicId,
          commentId: comment.id,
          reactionId: existing.userReactionId,
        })
      )
      return
    }

    dispatch(
      addReaction({
        topicId,
        commentId: comment.id,
        reaction: {
          id: `${user.id}-${comment.id}-${emoji}-${Date.now()}`,
          emoji,
          userId: user.id,
          commentId: comment.id,
        },
      })
    )
  }

  const pickerContent = (
    <EmojiPickerRow>
      {EMOJI_LIST.map(emoji => (
        <EmojiOption
          key={emoji}
          type="button"
          onClick={() => handlePickerSelect(emoji)}>
          {emoji}
        </EmojiOption>
      ))}
    </EmojiPickerRow>
  )

  return (
    <ReactionsRow>
      {groups.map(group => {
        const title = !user
          ? 'Войдите, чтобы поставить реакцию'
          : group.userReactionId !== null
          ? 'Убрать реакцию'
          : 'Поставить реакцию'

        return (
          <Tooltip key={group.emoji} title={title}>
            <ReactionBadge
              type="button"
              $active={group.userReactionId !== null}
              $disabled={!user}
              onClick={() => handleToggle(group)}>
              {group.emoji} <ReactionCount>{group.count}</ReactionCount>
            </ReactionBadge>
          </Tooltip>
        )
      })}

      <Popover
        content={pickerContent}
        trigger="click"
        open={pickerOpen}
        onOpenChange={open => {
          if (!user) return
          setPickerOpen(open)
        }}
        placement="bottomLeft">
        <Tooltip title={!user ? 'Войдите, чтобы поставить реакцию' : ''}>
          <span>
            <AddButton type="text" size="small" disabled={!user}>
              +
            </AddButton>
          </span>
        </Tooltip>
      </Popover>
    </ReactionsRow>
  )
}

const ReactionsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`

const ReactionBadge = styled.button<{ $active: boolean; $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--primary-color)' : '#3a3a6a')};
  background: ${({ $active }) =>
    $active ? 'rgba(0, 255, 156, 0.12)' : 'rgba(255, 255, 255, 0.04)'};
  color: var(--text-color);
  font-size: 13px;
  line-height: 1.4;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ $disabled }) =>
      $disabled ? undefined : 'var(--primary-color)'};
    background: ${({ $disabled }) =>
      $disabled ? undefined : 'rgba(0, 255, 156, 0.08)'};
  }
`

const ReactionCount = styled.span`
  font-size: 11px;
  color: var(--label-color);
`

const EmojiPickerRow = styled.div`
  display: flex;
  gap: 2px;
`

const EmojiOption = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: transform 0.1s, background 0.1s;

  &:hover {
    transform: scale(1.25);
    background: rgba(0, 255, 156, 0.1);
  }
`

const AddButton = styled(Button)`
  color: var(--label-color) !important;
  font-size: 16px;
  line-height: 1;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px dashed #3a3a6a !important;
  height: auto;

  &:not(:disabled):hover {
    color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
  }
`
