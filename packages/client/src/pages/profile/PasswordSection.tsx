import { Button, Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'
import { validationRules } from '../../validation/validators'
import { ProfileForm, ProfileSubmitRow } from './ProfilePage.styled'

interface PasswordSectionProps {
  form: FormInstance
  onChangePassword: (values: {
    oldPassword: string
    newPassword: string
  }) => void
}

export const PasswordSection = ({
  form,
  onChangePassword,
}: PasswordSectionProps) => {
  return (
    <ProfileForm
      form={form}
      layout="horizontal"
      labelCol={{ flex: '180px' }}
      wrapperCol={{ flex: 1 }}
      onFinish={onChangePassword}>
      <Form.Item
        label="Старый пароль"
        name="oldPassword"
        rules={[{ required: true, message: 'Введите текущий пароль' }]}>
        <Input.Password placeholder="Текущий пароль" />
      </Form.Item>

      <Form.Item
        label="Новый пароль"
        name="newPassword"
        rules={validationRules.password}>
        <Input.Password placeholder="Новый пароль" />
      </Form.Item>

      <ProfileSubmitRow>
        <Button type="primary" htmlType="submit" block>
          Изменить пароль
        </Button>
      </ProfileSubmitRow>
    </ProfileForm>
  )
}
