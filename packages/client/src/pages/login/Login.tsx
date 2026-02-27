import { Button, Form, Input, message } from 'antd'
import './login.scss'
import { LoginData, loginUser } from './LoginService'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSave = async (values: LoginData) => {
    const result = await loginUser(values)

    if (result.ok) {
      localStorage.setItem('isAuth', 'true')
      form.resetFields()
      navigate('/profile')
    } else {
      message.error(`Ошибка: ${result.reason}`)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Войти</h1>
        <form id="loginForm" className="form"></form>
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
        <a className="login__register" href="/register">
          Еще не зарегестрированы?
        </a>
      </div>
    </div>
  )
}

export const initLoginPage = () => Promise.resolve()
