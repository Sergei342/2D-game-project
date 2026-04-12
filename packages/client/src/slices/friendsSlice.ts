import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { SERVER_HOST } from '@/constants'

export interface Friend {
  name: string
  secondName: string
  avatar: string
}

export interface FriendsState {
  data: Array<Friend>
  isLoading: boolean
  error: string | null
}

const initialState: FriendsState = {
  data: [],
  isLoading: false,
  error: null,
}

export const fetchFriendsThunk = createAsyncThunk<
  Friend[],
  void,
  { rejectValue: string }
>('user/fetchFriendsThunk', async (_, { rejectWithValue }) => {
  try {
    const url = `${SERVER_HOST}/friends`
    const response = await fetch(url, {
      credentials: 'include',
    })

    if (!response.ok) {
      let errorMessage = `Ошибка ${response.status}`

      try {
        const errorBody = await response.json()
        if (errorBody?.reason) {
          errorMessage = errorBody.reason
        }
      } catch {
        // ignore
      }

      return rejectWithValue(errorMessage)
    }

    return (await response.json()) as Friend[]
  } catch {
    return rejectWithValue('Не удалось загрузить список друзей')
  }
})

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFriendsThunk.pending, state => {
        state.data = []
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchFriendsThunk.fulfilled,
        (state, { payload }: PayloadAction<Friend[]>) => {
          state.data = payload
          state.isLoading = false
          state.error = null
        }
      )
      .addCase(fetchFriendsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.data = []
        state.error = action.payload ?? 'Не удалось загрузить список друзей'
      })
  },
})

export const selectFriends = (state: RootState) => state.friends.data
export const selectIsLoadingFriends = (state: RootState) =>
  state.friends.isLoading
export const selectFriendsError = (state: RootState) => state.friends.error

export default friendsSlice.reducer
