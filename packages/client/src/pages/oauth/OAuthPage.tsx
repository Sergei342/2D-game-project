import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { signInWithYandex } from '@/pages/login/OAuthService'
import { fetchUserThunk } from '@/slices/userSlice'
import { useDispatch } from '@/store'
import { OAUTH_REDIRECT_URI } from '@/shared/constants'

export const OAuthPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const code = searchParams.get('code')

    if (!code) {
      navigate('/login')
      return
    }

    const handleOAuth = async () => {
      try {
        await signInWithYandex(code, OAUTH_REDIRECT_URI)
        await dispatch(fetchUserThunk()).unwrap()
        navigate('/')
      } catch (error) {
        console.error('OAuth error:', error)
        message.error(
          error instanceof Error
            ? error.message
            : 'Ошибка авторизации через Яндекс'
        )
        navigate('/login')
      }
    }

    handleOAuth()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <Spin size="large" tip="Авторизация через Яндекс..." />
    </div>
  )
}

export const initOAuthPage = () => Promise.resolve()
