import { selectUser } from '@/slices/userSlice'
import { useSelector } from '@/store'
import { Form, message, Modal } from 'antd'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CommentDTO,
  useAddCommentMutation,
  useGetTopicCommentsQuery,
  useGetTopicQuery,
  useRemoveCommentMutation,
  useUpdateCommentMutation,
} from '../Forum.api'
import { getAuthorName } from '@/shared/getAuthorName'
import { CommentForm, CommentFormMode } from './ForumTopicPage.types'

export const useForumTopicPageData = () => {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const parsedTopicId = Number(topicId)
  const isValidTopicId = Number.isFinite(parsedTopicId)

  const user = useSelector(selectUser)

  const commentsRef = useRef<HTMLDivElement | null>(null)
  const commentRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const textareaRef = useRef<TextAreaRef | null>(null)

  const [form] = Form.useForm<CommentForm>()

  const [addComment, { isLoading: isLoadingAddComment }] =
    useAddCommentMutation()
  const [updateComment, { isLoading: isLoadingUpdateComment }] =
    useUpdateCommentMutation()
  const [removeComment] = useRemoveCommentMutation()

  const [formMode, setFormMode] = useState<CommentFormMode>({ type: 'create' })
  const [flashCommentId, setFlashCommentId] = useState<number | null>(null)
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null)

  const activeCommentId = formMode.type === 'create' ? null : formMode.commentId

  const {
    data: topic,
    isLoading,
    error,
    refetch: refetchGetTopic,
  } = useGetTopicQuery({ topicId: parsedTopicId }, { skip: !isValidTopicId })

  const {
    data: comments,
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchGetComments,
  } = useGetTopicCommentsQuery(
    { topicId: parsedTopicId },
    { skip: !isValidTopicId }
  )

  const focusTextarea = useCallback(() => {
    form.scrollToField('text', { behavior: 'smooth' })

    requestAnimationFrame(() => {
      textareaRef.current?.focus({
        cursor: 'end',
      })
    })
  }, [form])

  const handleReplyComment = useCallback(
    (commentId: number) => {
      form.resetFields()
      setFormMode({ type: 'reply', commentId })
      focusTextarea()
    },
    [focusTextarea]
  )

  const handleSubmit = async ({ text }: CommentForm) => {
    if (!isValidTopicId || !user) {
      return
    }

    try {
      if (formMode.type === 'edit') {
        const updatedComment = await updateComment({
          id: formMode.commentId,
          text: text.trim(),
        }).unwrap()

        setTargetCommentId(updatedComment.id)
      } else {
        const newComment = await addComment({
          topicId: parsedTopicId,
          parentId: formMode.type === 'reply' ? formMode.commentId : null,
          text: text.trim(),
          authorId: user.id,
          displayName: getAuthorName(user),
          avatar: user.avatar,
        }).unwrap()

        setTargetCommentId(newComment.id)
      }

      form.resetFields()
      setFormMode({ type: 'create' })
    } catch (e) {
      console.log(e)
      message.error('При обработке комментария произошла ошибка')
    }
  }

  const handleEditComment = useCallback(
    (comment: CommentDTO) => {
      setFormMode({
        type: 'edit',
        commentId: comment.id,
        text: comment.text,
      })

      form.setFieldsValue({ text: comment.text })
      focusTextarea()
    },
    [form, focusTextarea]
  )

  const confirmDeleteComment = useCallback(
    (commentId: number) => {
      Modal.confirm({
        title: 'Удалить комментарий?',
        content: `Ваш комментарий #${commentId} будет удалён вместе с ответами на него`,
        okText: 'Удалить',
        cancelText: 'Отмена',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            return await removeComment({ commentId }).unwrap()
          } catch {
            message.error('Ошибка при удалении комментария')
          }
        },
      })
    },
    [removeComment]
  )

  const handleCancelMode = useCallback(() => {
    setFormMode({ type: 'create' })
    form.resetFields()
  }, [form])

  const goToForumTopicsPage = useCallback(() => {
    navigate('/forum')
  }, [navigate])

  const handleAnimationEndFlashing = () => {
    setFlashCommentId(null)
  }

  useEffect(() => {
    if (commentsError) {
      message.warning('При загрузке комментариев произошла ошибка')
    }
  }, [commentsError])

  // scrollToCommentWithFlash
  useEffect(() => {
    if (!targetCommentId || !comments?.length) {
      return
    }

    const commentElement = commentRefs.current?.[targetCommentId]
    commentElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    setFlashCommentId(targetCommentId)
  }, [targetCommentId, comments])

  return {
    user,
    isLoading,
    isLoadingComments,
    isValidTopicId,
    isSubmitDisabled: !isValidTopicId || !user,
    isSubmitting: isLoadingAddComment || isLoadingUpdateComment,
    error,
    topic,
    comments,
    commentsError,
    commentsRef,
    commentRefs,
    textareaRef,
    activeCommentId,
    flashCommentId,
    formMode,
    form,
    refetchGetTopic,
    refetchGetComments,
    confirmDeleteComment,
    onSubmit: handleSubmit,
    onReplyComment: handleReplyComment,
    onEditComment: handleEditComment,
    onCancelMode: handleCancelMode,
    goToForumTopicsPage,
    onAnimationEndFlashing: handleAnimationEndFlashing,
  }
}
