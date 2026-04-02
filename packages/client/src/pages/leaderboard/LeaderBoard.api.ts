import { api } from '@/api/baseApi'
import {
  API_FIELD_TEAM_NAME,
  API_FILED_RATING_FIELD_NAME,
} from '@/shared/constants'
import { User } from '@/slices/userSlice'

type LeaderBoardData = User & {
  [API_FILED_RATING_FIELD_NAME]: number
}

export type LeaderBoardDTO = {
  data: LeaderBoardData
}

type GetLeaderBoardParams = {
  cursor?: number
  limit?: number
}

export const leaderBoardApi = api.injectEndpoints({
  endpoints: builder => ({
    getLeaderBoard: builder.query<
      LeaderBoardDTO[],
      GetLeaderBoardParams | void
    >({
      query: params => ({
        url: '/leaderboard/all',
        method: 'POST',
        body: {
          ratingFieldName: API_FILED_RATING_FIELD_NAME,
          cursor: params?.cursor ?? 0,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: ['LeaderBoard'],
    }),

    addScore: builder.mutation<void, { data: unknown }>({
      query: ({ data }) => ({
        url: '/leaderboard',
        method: 'POST',
        body: {
          data,
          ratingFieldName: API_FILED_RATING_FIELD_NAME,
          teamName: API_FIELD_TEAM_NAME,
        },
      }),
      invalidatesTags: ['LeaderBoard'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetLeaderBoardQuery, useAddScoreMutation } = leaderBoardApi
