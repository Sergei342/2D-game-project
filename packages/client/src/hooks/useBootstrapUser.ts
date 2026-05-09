import { useEffect } from 'react'
import { useDispatch, useSelector } from '../store'
import { fetchUserThunk, selectAuthStatus } from '../slices/userSlice'

export const useBootstrapUser = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectAuthStatus)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserThunk())
    }
  }, [status])
}
