import { Button, Form, Input, message } from 'antd'
import './Register.scss'
import { RegisterData, registerUser } from './RegisterService'
import { useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSave = async (values: RegisterData) => {
    const result = await registerUser(values)

    if (result.id) {
      message.success(`Пользователь зарегистрирован! ID: ${result.id}`)
      form.resetFields()
      navigate('/login')
    } else {
      message.error(`Ошибка: ${result.reason}`)
    }
  }

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">Регистрация</h1>
        <form id="registerForm" className="form"></form>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Имя"
            name="first_name"
            rules={[{ required: true, message: 'Введите имя' }]}>
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name="second_name"
            rules={[{ required: true, message: 'Введите фамилию' }]}>
            <Input placeholder="Введите фамилию" />
          </Form.Item>
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Логин' }]}>
            <Input placeholder="Логин" />
          </Form.Item>
          <Form.Item
            label="Почта"
            name="email"
            rules={[{ required: true, message: 'Почта' }]}>
            <Input placeholder="Почта" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пароль' }]}>
            <Input placeholder="Пароль" />
          </Form.Item>
          <Form.Item
            label="Номер телефона"
            name="phone"
            rules={[{ required: true, message: 'Номер телефона' }]}>
            <Input placeholder="Номер телефона" />
          </Form.Item>
          <Form.Item className="profile-submit-row">
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export const initRegisterPage = () => Promise.resolve()
