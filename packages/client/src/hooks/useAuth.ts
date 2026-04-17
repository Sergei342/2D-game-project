import { useSelector } from '../store'
import {
  selectIsLoadingUser,
  selectIsUserInitialized,
  selectUser,
} from '../slices/userSlice'

export const useAuth = () => {
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoadingUser)
  const isInitialized = useSelector(selectIsUserInitialized)

  return {
    user,
    isAuth: Boolean(user),
    isLoading,
    isInitialized,
  }
}
