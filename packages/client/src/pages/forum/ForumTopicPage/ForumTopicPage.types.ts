export type CommentForm = { text: string }
export type CommentFormMode =
  | { type: 'create' }
  | { type: 'reply'; commentId: number }
  | { type: 'edit'; commentId: number; text: string }
