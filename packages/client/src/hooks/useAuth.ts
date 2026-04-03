import { useSelector } from '@/store'
import { selectIsLoadingUser, selectUser } from '@/slices/userSlice'

export const useAuth = () => {
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoadingUser)

  return { user, isAuth: !!user, isLoading }
}
