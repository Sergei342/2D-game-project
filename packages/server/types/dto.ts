export interface AuthorDTO {
  id: number
  displayName: string
  avatar: string | null
}

export interface ReactionDTO {
  id: number
  type: string
  userId: number
}

export interface CommentNodeDTO {
  id: number
  text: string
  authorId: number
  author?: AuthorDTO
  topicId: number
  parentId: number | null
  reactions: ReactionDTO[]
  replies: CommentNodeDTO[]
  createdAt: string
  updatedAt: string
}

export interface UserProfileDTO {
  id: number
  displayName: string
  avatar?: string | null
}
