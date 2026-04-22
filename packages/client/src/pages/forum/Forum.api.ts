import { apiForum } from '@/api/forumApi'

export type AuthorDTO = {
  id: number
  displayName: string
  avatar: string
}

export type TopicDTO = {
  id: number
  title: string
  description: string
  authorId: number
  author: AuthorDTO
  commentsCount: number
  createdAt: string
  updatedAt: string
}

type GetTopicsParams = {
  page?: number
  pageSize?: number
}

type GetTopicsResponse = {
  data: TopicDTO[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type TopicsViewModel = {
  items: TopicDTO[]
  page: number
  size: number
  total: number
  totalPages: number
}

type CreateTopicData = {
  title: string
  description: string
  authorId: number
  displayName: string
  avatar: string | null
}

type UpdateTopicData = {
  id: number
  title: string
  description: string
}

type ReactionDTO = {
  id: number
  type: string
  userId: number
  commentId: number
}

export type CommentDTO = {
  id: number
  text: string
  authorId: number
  author: AuthorDTO
  topicId: number
  parentId: number | null
  reactions: ReactionDTO[]
  replies: CommentDTO[]
  createdAt: string
  updatedAt: string
}

type CreateCommentData = {
  topicId: number
  parentId: number | null
  text: string
  authorId: number
  displayName: string
  avatar: string | null
}

const PAGE_SIZE_DEFAULT = 10

export const forumApi = apiForum.injectEndpoints({
  endpoints: builder => ({
    getTopics: builder.query<TopicsViewModel, GetTopicsParams | undefined>({
      query: (params = {}) => ({
        url: '/topics',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? PAGE_SIZE_DEFAULT,
        },
      }),
      transformResponse: ({
        data,
        page,
        pageSize,
        totalPages,
        total,
      }: GetTopicsResponse): TopicsViewModel => ({
        items: data,
        page,
        size: pageSize,
        total,
        totalPages,
      }),
      providesTags: ['Topics'],
    }),

    getTopic: builder.query<TopicDTO, { topicId: number }>({
      query: ({ topicId }) => ({
        url: `/topics/${topicId}`,
        method: 'GET',
      }),
      providesTags: ['Topic'],
    }),

    getTopicComments: builder.query<CommentDTO[], { topicId: number }>({
      query: ({ topicId }) => ({
        url: `/topics/${topicId}/comments`,
        method: 'GET',
      }),
      providesTags: ['Comments'],
    }),

    addTopic: builder.mutation<TopicDTO, CreateTopicData>({
      query: topic => ({
        url: '/topics',
        method: 'POST',
        body: topic,
      }),
      invalidatesTags: ['Topics'],
    }),

    updateTopic: builder.mutation<TopicDTO, UpdateTopicData>({
      query: ({ id, ...topic }) => ({
        url: `/topics/${id}`,
        method: 'PUT',
        body: topic,
      }),
      invalidatesTags: ['Topics'],
    }),

    removeTopic: builder.mutation<{ ok: true }, { topicId: number }>({
      query: ({ topicId }) => ({
        url: `/topics/${topicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Topics'],
    }),

    addComment: builder.mutation<CommentDTO, CreateCommentData>({
      query: comment => ({
        url: `/topics/${comment.topicId}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: ['Comments'],
    }),

    updateComment: builder.mutation<CommentDTO, { id: number; text: string }>({
      query: ({ id, text }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: ['Comments'],
    }),

    removeComment: builder.mutation<{ ok: true }, { commentId: number }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTopicsQuery,
  useAddTopicMutation,
  useUpdateTopicMutation,
  useRemoveTopicMutation,
  useGetTopicQuery,
  useGetTopicCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useRemoveCommentMutation,
} = forumApi
