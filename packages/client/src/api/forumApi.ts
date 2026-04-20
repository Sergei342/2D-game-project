import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import fetch from 'cross-fetch'
import { SERVER_HOST } from '@/constants'

// ─── Типы эмодзи-реакций ────────────────────────────────────────────────────

export const REACTION_TYPES = ['👍', '❤️', '😂', '😢', '😡'] as const
export type ReactionType = typeof REACTION_TYPES[number]

// ─── DTO (соответствуют контракту backend swagger) ───────────────────────────

export interface ReactionDTO {
  id: number
  type: string
  userId: number
  commentId: number
}

export interface AuthorDTO {
  id: number
  displayName: string
  avatar: string | null
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

export interface TopicItemDTO {
  id: number
  title: string
  description: string
  authorId: number
  author?: AuthorDTO
  commentsCount: number
  createdAt: string
  updatedAt: string
}

export interface TopicListResponseDTO {
  data: TopicItemDTO[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// ─── RTK Query API ───────────────────────────────────────────────────────────

// Отдельная инстанция (не injectEndpoints в baseApi) —
// forum backend использует SERVER_HOST, а не BASE_URL (Yandex API).
export const forumApi = createApi({
  reducerPath: 'forumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_HOST}/api/v1/forum`,
    credentials: 'include',
    fetchFn: fetch,
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Topics', 'Comments'],
  endpoints: builder => ({
    // ── Topics ──────────────────────────────────────────────────────────────

    getTopics: builder.query<TopicListResponseDTO, void>({
      query: () => '/topics',
      providesTags: ['Topics'],
    }),

    getTopic: builder.query<TopicItemDTO, number>({
      query: id => `/topics/${id}`,
      providesTags: (_, __, id) => [{ type: 'Topics', id }],
    }),

    createTopic: builder.mutation<
      TopicItemDTO,
      {
        title: string
        description: string
        authorId: number
        displayName: string
        avatar?: string | null
      }
    >({
      query: body => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Topics'],
    }),

    deleteTopic: builder.mutation<{ ok: boolean }, number>({
      query: id => ({
        url: `/topics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Topics'],
    }),

    // ── Comments ─────────────────────────────────────────────────────────────

    // Возвращает дерево комментариев с вложенными replies и reactions.
    // Реакции встроены — отдельный getReactions endpoint не нужен в основном потоке.
    getComments: builder.query<CommentNodeDTO[], number>({
      query: topicId => `/topics/${topicId}/comments`,
      providesTags: (_, __, topicId) => [{ type: 'Comments', id: topicId }],
    }),

    createComment: builder.mutation<
      CommentNodeDTO,
      {
        topicId: number
        text: string
        authorId: number
        displayName: string
        avatar?: string | null
        parentId?: number | null
      }
    >({
      query: ({ topicId, ...body }) => ({
        url: `/topics/${topicId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'Comments', id: topicId },
      ],
    }),

    // ── Reactions ─────────────────────────────────────────────────────────────
    // После любой мутации инвалидируем Comments для топика,
    // чтобы RTK Query перезапросил список комментариев с актуальными реакциями.

    addReaction: builder.mutation<
      ReactionDTO,
      { commentId: number; type: string; userId: number; topicId: number }
    >({
      query: ({ commentId, type, userId }) => ({
        url: `/comments/${commentId}/reactions`,
        method: 'POST',
        body: { type, userId },
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'Comments', id: topicId },
      ],
    }),

    updateReaction: builder.mutation<
      ReactionDTO,
      { commentId: number; type: string; userId: number; topicId: number }
    >({
      query: ({ commentId, type, userId }) => ({
        url: `/comments/${commentId}/reactions`,
        method: 'PUT',
        body: { type, userId },
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'Comments', id: topicId },
      ],
    }),

    deleteReaction: builder.mutation<
      { ok: boolean },
      { commentId: number; userId: number; topicId: number }
    >({
      query: ({ commentId, userId }) => ({
        url: `/comments/${commentId}/reactions`,
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: (_, __, { topicId }) => [
        { type: 'Comments', id: topicId },
      ],
    }),
  }),
})

export const {
  useGetTopicsQuery,
  useGetTopicQuery,
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useAddReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} = forumApi
