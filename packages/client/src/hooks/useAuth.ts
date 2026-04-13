import { useEffect } from 'react'
import { useDispatch, useSelector } from '../store'
import {
  fetchUserThunk,
  selectIsLoadingUser,
  selectIsUserInitialized,
  selectUser,
} from '../slices/userSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const isUserInitialized = useSelector(selectIsUserInitialized)

  useEffect(() => {
    if (!isUserInitialized && !isLoadingUser) {
      void dispatch(fetchUserThunk())
    }
  }, [dispatch, isUserInitialized, isLoadingUser])

  return {
    isAuth: Boolean(user),
    isLoading: !isUserInitialized || isLoadingUser,
    user,
  }
}
