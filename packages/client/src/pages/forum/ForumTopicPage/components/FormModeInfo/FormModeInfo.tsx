import { CommentFormMode } from '../../ForumTopicPage.types'
import { Button, Typography } from 'antd'

type FormModeInfoProps = {
  formMode: CommentFormMode
  onCancelMode: () => void
}

const { Text } = Typography

export const FormModeInfo = ({ formMode, onCancelMode }: FormModeInfoProps) => {
  if (formMode.type === 'create') {
    return null
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <Text type="secondary">
        {formMode.type === 'reply' &&
          `Ответ на комментарий #${formMode.commentId}`}

        {formMode.type === 'edit' &&
          `Редактирование комментария #${formMode.commentId}`}
      </Text>
      <Button type="link" size="small" onClick={onCancelMode}>
        Отмена
      </Button>
    </div>
  )
}
