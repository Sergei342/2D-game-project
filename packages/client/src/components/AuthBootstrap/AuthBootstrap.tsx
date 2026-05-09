import { PropsWithChildren } from 'react'

import { useSelector } from '@/store'
import { selectAuthStatus } from '@/slices/userSlice'
import { FullscreenLoader } from '@/components/FullscreenLoader'
import { useBootstrapUser } from '@/hooks/useBootstrapUser'

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
  const status = useSelector(selectAuthStatus)

  useBootstrapUser()

  if (status === 'idle' || status === 'loading') {
    return <FullscreenLoader />
  }

  return <>{children}</>
}
