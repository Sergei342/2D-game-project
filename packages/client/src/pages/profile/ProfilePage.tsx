import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { usePage } from '../../hooks/usePage'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  profileService,
  UserProfile,
  UnauthorizedError,
} from './ProfileService'

import { Button, Input, Form, message, Collapse, Avatar } from 'antd'
import './ProfilePage.scss'
import { MAX_AVATAR_SIZE } from './consts'
import { UserOutlined } from '@ant-design/icons'
import { PageInitArgs } from '../../routes/types'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUnauthorized = useCallback(() => {
    message.error('Сессия истекла. Перенаправляем на страницу входа…')
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    profileService
      .getUser()
      .then((data: UserProfile | null) => {
        if (cancelled || !data) {
          return
        }

        setUser(data)

        form.setFieldsValue({
          first_name: data.first_name,
          second_name: data.second_name,
          display_name: data.display_name ?? '',
          login: data.login,
          email: data.email,
          phone: data.phone,
        })
      })
      .catch(err => {
        if (cancelled) return

        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }

        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [form, handleUnauthorized])

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        return
      }

      if (file.size > MAX_AVATAR_SIZE) {
        message.error('Файл слишком большой. Максимум 3 МБ')
        return
      }

      try {
        const updated = await profileService.changeAvatar(file)
        setUser(updated)
        message.success('Аватар обновлён')
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }
        message.error('Не удалось загрузить аватар')
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [handleUnauthorized]
  )

  const handleSave = useCallback(
    async (values: Record<string, string>) => {
      setSaving(true)
      setError(null)

      try {
        const updated = await profileService.updateProfile({
          first_name: values.first_name,
          second_name: values.second_name,
          display_name: values.display_name,
          login: values.login,
          email: values.email,
          phone: values.phone,
        })

        setUser(updated)
        message.success('Профиль успешно сохранён')
      } catch (err: any) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }
        setError(err.message)
        message.error(err.message || 'Не удалось сохранить профиль')
      } finally {
        setSaving(false)
      }
    },
    [handleUnauthorized]
  )

  const handlePassword = useCallback(
    async (values: { oldPassword: string; newPassword: string }) => {
      try {
        await profileService.changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })

        message.success('Пароль успешно изменён')
        passwordForm.resetFields()
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }
        message.error('Не удалось сменить пароль')
      }
    },
    [passwordForm, handleUnauthorized]
  )

  if (loading) {
    return <p className="profile-loading">Загрузка…</p>
  }

  if (error && !user) {
    return <p className="profile-error">{error}</p>
  }

  const avatarSrc = profileService.avatarUrl(user?.avatar ?? null)

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const buttonLayout = {
    wrapperCol: { offset: 0, span: 24 },
  }

  const collapseItems = [
    {
      key: 'profile',
      label: 'Профиль',
      children: (
        <div>
          <div className="profile-avatar-section">
            <div
              className="avatar-wrapper"
              onClick={() => fileInputRef.current?.click()}>
              <Avatar
                src={avatarSrc}
                size={120}
                icon={<UserOutlined />}
                style={{ width: '100%', height: '100%' }}
              />
              <div className="avatar-overlay">
                <span>
                  сменить
                  <br />
                  аватар
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="avatar-file-input"
              onChange={handleAvatarChange}
            />
          </div>

          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSave}
            className="profile-form"
            {...formLayout}>
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

            <Form.Item className="profile-submit-row" {...buttonLayout}>
              <Button type="primary" htmlType="submit" block loading={saving}>
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'password',
      label: 'Сменить пароль',
      children: (
        <Form
          form={passwordForm}
          layout="horizontal"
          onFinish={handlePassword}
          className="profile-form"
          {...formLayout}>
          <Form.Item
            label="Старый пароль"
            name="oldPassword"
            rules={[{ required: true, message: 'Введите текущий пароль' }]}>
            <Input.Password placeholder="Текущий пароль" />
          </Form.Item>

          <Form.Item
            label="Новый пароль"
            name="newPassword"
            rules={[
              { required: true, message: 'Введите новый пароль' },
              { min: 6, message: 'Минимум 6 символов' },
            ]}>
            <Input.Password placeholder="Новый пароль" />
          </Form.Item>

          <Form.Item className="profile-submit-row" {...buttonLayout}>
            <Button type="primary" htmlType="submit" block>
              Изменить пароль
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>

      <div className="profile-page">
        <div className="profile-collapse-wrapper">
          <Collapse
            defaultActiveKey={['profile']}
            items={collapseItems}
            accordion={false}
            bordered={false}
          />
        </div>
      </div>
    </div>
  )
}

export const initProfilePage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы профиля, на будущее, когда подключим redux
}
