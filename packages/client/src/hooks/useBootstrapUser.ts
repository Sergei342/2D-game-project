import { useEffect } from 'react'
import { useDispatch, useSelector } from '../store'
import { fetchUserThunk, selectIsUserInitialized } from '../slices/userSlice'

export const useBootstrapUser = () => {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectIsUserInitialized)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchUserThunk())
    }
  }, [dispatch, isInitialized])
}
