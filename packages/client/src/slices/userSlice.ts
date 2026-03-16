import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { SERVER_HOST } from '@/constants'

export interface User {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  avatar: string | null
  email: string
  phone: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
}

export const fetchUserThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/fetchUserThunk', async (_, { rejectWithValue }) => {
  try {
    const url = new URL('/auth/user', SERVER_HOST)

    const response = await fetch(url.toString(), {
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

    return (await response.json()) as User
  } catch {
    return rejectWithValue('Не удалось загрузить пользователя')
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.data = payload
      state.isLoading = false
      state.error = null
    },
    clearUser: state => {
      state.data = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.data = action.payload
        state.isLoading = false
        state.error = null
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.isLoading = false
        state.data = null
        state.error = action.payload ?? 'Не удалось загрузить пользователя'
      })
  },
})

export const { setUser, clearUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.data
export const selectIsLoadingUser = (state: RootState) => state.user.isLoading
export const selectUserError = (state: RootState) => state.user.error

export default userSlice.reducer
