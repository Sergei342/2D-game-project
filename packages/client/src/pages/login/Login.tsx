import { Button, Form, Input, message } from 'antd'
import './Login.scss'
import { LoginData, loginUser } from './LoginService'
import { Link, useNavigate } from 'react-router-dom'
import { validationRules } from '../../validation/validators'
import { useDispatch } from '../../store'
import { fetchUserThunk } from '../../slices/userSlice'

export const LoginPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSave = async (values: LoginData) => {
    try {
      const result = await loginUser(values)

      if (result.ok) {
        await dispatch(fetchUserThunk())
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

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Войти</h1>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Логин" name="login" rules={validationRules.login}>
            <Input placeholder="Логин" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={validationRules.password}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          <Form.Item className="profile-submit-row">
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>

        <Link className="login__register" to="/register">
          Еще не зарегистрированы?
        </Link>
      </div>
    </div>
  )
}

export const initLoginPage = () => Promise.resolve()
