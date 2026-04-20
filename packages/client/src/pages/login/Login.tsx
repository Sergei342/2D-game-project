import { Button, Form, Input, message } from 'antd'
import './Login.scss'
import { LoginData, loginUser } from './LoginService'
import { getYandexServiceId } from './OAuthService'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUserThunk } from '@/slices/userSlice'
import { useDispatch } from '@/store'
import { useState } from 'react'
import { YANDEX_OAUTH_URL, OAUTH_REDIRECT_URI } from '@/shared/constants'

export const LoginPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [oauthLoading, setOauthLoading] = useState(false)

  const handleSave = async (values: LoginData) => {
    try {
      const result = await loginUser(values)

      if (result.ok) {
        await dispatch(fetchUserThunk()).unwrap()

        form.resetFields()
        navigate('/')
      } else {
        message.error(`Ошибка: ${result.reason}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      message.error('Произошла сетевая ошибка. Попробуйте позже.')
    }
  }

  const handleYandexLogin = async () => {
    try {
      setOauthLoading(true)
      const { service_id } = await getYandexServiceId()
      const url = `${YANDEX_OAUTH_URL}?response_type=code&client_id=${service_id}&redirect_uri=${OAUTH_REDIRECT_URI}`
      document.location.href = url
    } catch (error) {
      console.error('OAuth error:', error)
      message.error('Не удалось запустить авторизацию через Яндекс')
      setOauthLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Войти</h1>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Логин' }]}>
            <Input placeholder="Логин" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пароль' }]}>
            <Input placeholder="Пароль" />
          </Form.Item>
          <Form.Item className="profile-submit-row">
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
        <Button
          block
          loading={oauthLoading}
          onClick={handleYandexLogin}
          style={{ marginBottom: 16 }}>
          Войти через Яндекс
        </Button>
        <Link className="login__register" to="/register">
          Еще не зарегестрированы?
        </Link>
      </div>
    </div>
  )
}

export const initLoginPage = () => Promise.resolve()
