import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'

export type ForumReaction = {
  id: string
  emoji: string
  userId: number
  commentId: string
}

export type ForumComment = {
  id: string
  author: string
  text: string
  createdAt: string
  avatar?: string | null
  reactions?: ForumReaction[]
}

export type ForumTopic = {
  id: string
  title: string
  description: string
  author: string
  createdAt: string
  comments: ForumComment[]
}

export interface ForumState {
  topics: ForumTopic[]
}

const initialState: ForumState = {
  topics: [],
}

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    addTopic: (
      state,
      { payload }: PayloadAction<Omit<ForumTopic, 'comments'>>
    ) => {
      state.topics.unshift({ ...payload, comments: [] })
    },
    addComment: (
      state,
      { payload }: PayloadAction<{ topicId: string; comment: ForumComment }>
    ) => {
      const topic = state.topics.find(t => t.id === payload.topicId)
      if (!topic) return
      topic.comments.push(payload.comment)
    },
    deleteTopic: (state, { payload }: PayloadAction<{ topicId: string }>) => {
      state.topics = state.topics.filter(t => t.id !== payload.topicId)
    },
    addReaction: (
      state,
      {
        payload,
      }: PayloadAction<{
        topicId: string
        commentId: string
        reaction: ForumReaction
      }>
    ) => {
      const topic = state.topics.find(t => t.id === payload.topicId)
      if (!topic) return
      const comment = topic.comments.find(c => c.id === payload.commentId)
      if (!comment) return
      if (!comment.reactions) comment.reactions = []
      const isDuplicate = comment.reactions.some(
        r =>
          r.userId === payload.reaction.userId &&
          r.emoji === payload.reaction.emoji
      )
      if (!isDuplicate) {
        comment.reactions.push(payload.reaction)
      }
    },
    removeReaction: (
      state,
      {
        payload,
      }: PayloadAction<{
        topicId: string
        commentId: string
        reactionId: string
      }>
    ) => {
      const topic = state.topics.find(t => t.id === payload.topicId)
      if (!topic) return
      const comment = topic.comments.find(c => c.id === payload.commentId)
      if (!comment || !comment.reactions) return
      comment.reactions = comment.reactions.filter(
        r => r.id !== payload.reactionId
      )
    },
  },
})

export const {
  addTopic,
  addComment,
  deleteTopic,
  addReaction,
  removeReaction,
} = forumSlice.actions

export const selectTopics = (state: RootState) => state.forum.topics
export const selectTopicById = (id: string) => (state: RootState) =>
  state.forum.topics.find(t => t.id === id)

export default forumSlice.reducer
