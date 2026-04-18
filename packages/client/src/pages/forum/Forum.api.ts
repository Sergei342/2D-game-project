import { UserProfile } from '../profile/ProfileService'
import { apiForum } from '@/api/forumApi'

export type TopicDTO = {
  id: number
  title: string
  description: string
  authorId: number
  author: UserProfile
  commentsCount: number
  createdAt: string
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

type TopicData = {
  title: string
  description: string
  authorId: number
  displayName: string
  avatar: string | null
}

export const forumApi = apiForum.injectEndpoints({
  endpoints: builder => ({
    getTopics: builder.query<GetTopicsResponse, GetTopicsParams | undefined>({
      query: (params = {}) => ({
        url: '/topics',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
        },
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

    addTopic: builder.mutation<void, { data: TopicData }>({
      query: ({ data }) => ({
        url: '/topics',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Topics'],
    }),

    removeTopic: builder.mutation<void, { topicId: number }>({
      query: ({ topicId }) => ({
        url: `/topics/${topicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Topics'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTopicsQuery,
  useAddTopicMutation,
  useRemoveTopicMutation,
  useGetTopicQuery,
} = forumApi
