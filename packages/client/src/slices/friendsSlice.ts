import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { fetchFriends, getFriendsErrorMessage } from '@/services/friendsApi'

export interface Friend {
  name: string
  secondName: string
  avatar: string | null
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
>('friends/fetchFriendsThunk', async (_, { rejectWithValue }) => {
  try {
    return await fetchFriends()
  } catch (error) {
    console.error('Ошибка при загрузке списка друзей', error)
    return rejectWithValue(getFriendsErrorMessage(error))
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
