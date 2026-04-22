import { useId } from 'react'
import { Avatar, Button, Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/es/form'
import {
  ProfileAvatarSection,
  AvatarWrapper,
  AvatarOverlay,
  AvatarFileInput,
  ProfileForm,
  ProfileSubmitRow,
} from './ProfilePage.styled'

interface ProfileSectionProps {
  avatarSrc: string | null
  form: FormInstance
  saving: boolean
  onSave: (values: Record<string, string>) => void
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ProfileSection = ({
  avatarSrc,
  form,
  saving,
  onSave,
  onAvatarChange,
}: ProfileSectionProps) => {
  const avatarInputId = useId()

  return (
    <div>
      <ProfileAvatarSection>
        <AvatarWrapper htmlFor={avatarInputId}>
          <Avatar
            src={avatarSrc}
            size={120}
            icon={<UserOutlined />}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          />
          <AvatarOverlay>
            <span>
              сменить
              <br />
              аватар
            </span>
          </AvatarOverlay>
        </AvatarWrapper>
        <AvatarFileInput
          id={avatarInputId}
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
      </ProfileAvatarSection>

      <ProfileForm
        form={form}
        layout="horizontal"
        labelCol={{ flex: '180px' }}
        wrapperCol={{ flex: 1 }}
        onFinish={values => onSave(values as Record<string, string>)}>
        <Form.Item
          label="Имя"
          name="first_name"
          rules={[{ required: true, message: 'Введите имя' }]}>
          <Input placeholder="Имя" />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="second_name"
          rules={[{ required: true, message: 'Введите фамилию' }]}>
          <Input placeholder="Фамилия" />
        </Form.Item>

        <Form.Item label="Отображаемое имя" name="display_name">
          <Input placeholder="Имя в чате" />
        </Form.Item>

        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: 'Введите логин' }]}>
          <Input placeholder="Логин" />
        </Form.Item>

        <Form.Item
          label="Почта"
          name="email"
          rules={[
            { required: true, message: 'Введите почту' },
            { type: 'email', message: 'Некорректный email' },
          ]}>
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[{ required: true, message: 'Введите телефон' }]}>
          <Input placeholder="+7 (999) 999-99-99" />
        </Form.Item>

        <ProfileSubmitRow>
          <Button type="primary" htmlType="submit" block loading={saving}>
            Сохранить
          </Button>
        </ProfileSubmitRow>
      </ProfileForm>
    </div>
  )
}
