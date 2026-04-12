import { useEffect, useRef } from 'react'
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

  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (user) {
      return
    }

    if (isLoadingUser) {
      return
    }

    if (hasRequestedRef.current && isUserInitialized) {
      return
    }

    hasRequestedRef.current = true
    void dispatch(fetchUserThunk())
  }, [dispatch, user, isLoadingUser, isUserInitialized])

  return {
    isAuth: Boolean(user),
    isLoading: !user && (!isUserInitialized || isLoadingUser),
    user,
  }
}
