import { selectUser } from '@/slices/userSlice'
import { useSelector } from '@/store'
import { Form, message, Modal } from 'antd'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CommentDTO,
  useAddCommentMutation,
  useGetTopicCommentsQuery,
  useGetTopicQuery,
  useRemoveCommentMutation,
  useRemoveTopicMutation,
  useUpdateCommentMutation,
} from '../Forum.api'
import { getAuthorName } from '@/shared/getAuthorName'

type CommentForm = { text: string }
type CommentFormMode =
  | { type: 'create' }
  | { type: 'reply'; commentId: number }
  | { type: 'edit'; commentId: number; text: string }

export const useForumTopicPageData = () => {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const topicIdNum = Number(topicId)
  const user = useSelector(selectUser)

  const commentsRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<TextAreaRef | null>(null)

  const [form] = Form.useForm<CommentForm>()

  const [removeTopic] = useRemoveTopicMutation()

  const [addComment, { isLoading: isLoadingAddComment }] =
    useAddCommentMutation()
  const [updateComment, { isLoading: isLoadingUpdateComment }] =
    useUpdateCommentMutation()
  const [removeComment] = useRemoveCommentMutation()

  const [formMode, setFormMode] = useState<CommentFormMode>({ type: 'create' })

  const activeCommentId = formMode.type === 'create' ? null : formMode.commentId

  const {
    data: topic,
    isLoading,
    error,
  } = useGetTopicQuery({ topicId: topicIdNum }, { skip: !topicIdNum })

  const { data: comments, isLoading: isLoadingComments } =
    useGetTopicCommentsQuery({ topicId: topicIdNum }, { skip: !topicIdNum })

  const scrollToCommentWithFlash = (commentId: number) => {
    setTimeout(() => {
      const commentElement = commentsRef.current?.querySelector(
        `#comment-${commentId}`
      ) as HTMLElement | null
      if (!commentElement) return

      commentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      commentElement.classList.remove('flash')
      void commentElement.offsetWidth
      commentElement.classList.add('flash')

      const handleEnd = () => {
        commentElement.classList.remove('flash')
        commentElement.removeEventListener('animationend', handleEnd)
      }

      commentElement.addEventListener('animationend', handleEnd)
    }, 300)
  }

  const focusTextarea = useCallback(() => {
    form.scrollToField('text', { behavior: 'smooth' })

    setTimeout(() => {
      textareaRef.current?.focus()

      textareaRef.current?.resizableTextArea?.textArea?.setSelectionRange(
        textareaRef.current.resizableTextArea.textArea.value.length,
        textareaRef.current.resizableTextArea.textArea.value.length
      )
    }, 300)
  }, [form])

  const handleReplyComment = useCallback(
    (commentId: number) => {
      setFormMode({ type: 'reply', commentId })
      focusTextarea()
    },
    [focusTextarea]
  )

  const handleSubmit = async ({ text }: CommentForm) => {
    if (!topicIdNum || !user) {
      return
    }

    try {
      if (formMode.type === 'edit') {
        const updatedComment = await updateComment({
          id: formMode.commentId,
          text: text.trim(),
        }).unwrap()

        scrollToCommentWithFlash(updatedComment.id)
      } else {
        const newComment = await addComment({
          topicId: topicIdNum,
          parentId: formMode.type === 'reply' ? formMode.commentId : null,
          text: text.trim(),
          authorId: user.id,
          displayName: getAuthorName(user),
          avatar: user.avatar,
        }).unwrap()

        scrollToCommentWithFlash(newComment.id)
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

  const confirmDeleteTopic = useCallback(() => {
    if (!topicIdNum || !topic) {
      return
    }

    Modal.confirm({
      title: 'Удалить топик?',
      content: `Топик «${topic.title}» будет удалён вместе с комментариями`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeTopic({ topicId: topic.id }).unwrap()
          navigate('/forum')
        } catch {
          message.error('При удалении топика произошла ошибка')
        }
      },
    })
  }, [removeTopic, topic, navigate])

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

  return {
    user,
    isLoading,
    isLoadingComments,
    isLoadingAddComment,
    isLoadingUpdateComment,
    error,
    topic,
    comments,
    commentsRef,
    textareaRef,
    activeCommentId,
    formMode,
    form,
    confirmDeleteTopic,
    confirmDeleteComment,
    onSubmit: handleSubmit,
    onReplyComment: handleReplyComment,
    onEditComment: handleEditComment,
    onCancelMode: handleCancelMode,
    goToForumTopicsPage,
  }
}
