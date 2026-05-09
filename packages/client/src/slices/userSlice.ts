import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { BASE_URL } from '@/shared/constants'

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
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: string | null
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
}

export const fetchUserThunk = createAsyncThunk<
  User,
  { cookie?: string } | void,
  { rejectValue: string }
>('user/fetchUserThunk', async (args, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/user`, {
      credentials: 'include',
      headers: args?.cookie
        ? {
            Cookie: args.cookie,
          }
        : undefined,
    })

    if (!response.ok) {
      let errorMessage = `Ошибка ${response.status}`

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        try {
          const errorBody = await response.json()

          if (errorBody?.reason) {
            errorMessage = errorBody.reason
          }
        } catch (e) {
          console.error('Failed to parse error response', e)
        }
      }

      return rejectWithValue(errorMessage)
    }

    return (await response.json()) as User
  } catch (e) {
    console.error('fetchUserThunk failed', e)

    return rejectWithValue('Не удалось загрузить пользователя')
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.data = payload
      state.status = 'authenticated'
      state.error = null
    },
    clearUser: state => {
      state.data = null
      state.status = 'unauthenticated'
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'authenticated'
        state.error = null
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.data = null
        state.error = action.payload ?? 'Не удалось загрузить пользователя'
      })
  },
})

export const { setUser, clearUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.data
export const selectIsLoadingUser = (state: RootState) =>
  state.user.status === 'loading'
export const selectAuthStatus = (state: RootState) => state.user.status
export const selectUserError = (state: RootState) => state.user.error

export default userSlice.reducer
