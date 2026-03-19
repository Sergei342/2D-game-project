import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { usePage } from '../../hooks/usePage'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  profileService,
  UserProfile,
  UnauthorizedError,
} from './ProfileService'

import { MAX_AVATAR_SIZE, MAX_AVATAR_SIZE_MB_UNITS } from './consts'
import { Form, message, Collapse } from 'antd'

import {
  ProfilePageWrapper,
  ProfileCollapseWrapper,
  ProfileLoading,
  ProfileError,
} from './ProfilePage.styled'
import { PasswordSection } from './PasswordSection'
import { ProfileSection } from './ProfileSection'
import { GeoSectionContent } from './GeoSection'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  const formRef = useRef(form)
  formRef.current = form

  const passwordFormRef = useRef(passwordForm)
  passwordFormRef.current = passwordForm

  const handleUnauthorized = useCallback(() => {
    message.error('Сессия истекла. Перенаправляем на страницу входа…')
    navigate('/login')
  }, [navigate])

  const handleUnauthorizedRef = useRef(handleUnauthorized)
  handleUnauthorizedRef.current = handleUnauthorized

  useEffect(() => {
    const controller = new AbortController()

    profileService
      .getUser({ signal: controller.signal })
      .then((data: UserProfile | null) => {
        if (controller.signal.aborted) return

        if (!data) {
          setError('Не удалось загрузить данные профиля')
          return
        }

        setUser(data)

        formRef.current.setFieldsValue({
          first_name: data.first_name,
          second_name: data.second_name,
          display_name: data.display_name ?? '',
          login: data.login,
          email: data.email,
          phone: data.phone,
        })
      })
      .catch(err => {
        if (controller.signal.aborted) return

        if (err instanceof UnauthorizedError) {
          handleUnauthorizedRef.current()
          return
        }

        setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [])

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const file = e.target.files?.[0]

      if (!file) {
        return
      }

      if (file.size > MAX_AVATAR_SIZE * MAX_AVATAR_SIZE_MB_UNITS) {
        message.error(`Файл слишком большой. Максимум ${MAX_AVATAR_SIZE} МБ`)
        return
      }

      try {
        const updated = await profileService.changeAvatar(file)
        setUser(updated)
        message.success('Аватар обновлён')
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorizedRef.current()
          return
        }
        message.error('Не удалось загрузить аватар')
      } finally {
        input.value = ''
      }
    },
    []
  )

  const handleSave = useCallback(async (values: Record<string, string>) => {
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
    } catch (err: unknown) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorizedRef.current()
        return
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Не удалось сохранить профиль'

      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }, [])

  const handlePassword = useCallback(
    async (values: { oldPassword: string; newPassword: string }) => {
      try {
        await profileService.changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })

        message.success('Пароль успешно изменён')
        passwordFormRef.current.resetFields()
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorizedRef.current()
          return
        }
        message.error('Не удалось сменить пароль')
      }
    },
    []
  )

  if (loading) {
    return <ProfileLoading>Загрузка…</ProfileLoading>
  }

  if (error && !user) {
    return <ProfileError>{error}</ProfileError>
  }

  const avatarSrc = profileService.avatarUrl(user?.avatar ?? null)

  const collapseItems = [
    {
      key: 'profile',
      label: 'Профиль',
      children: (
        <ProfileSection
          avatarSrc={avatarSrc}
          form={form}
          saving={saving}
          onSave={handleSave}
          onAvatarChange={handleAvatarChange}
        />
      ),
    },
    {
      key: 'password',
      label: 'Сменить пароль',
      children: (
        <PasswordSection
          form={passwordForm}
          onChangePassword={handlePassword}
        />
      ),
    },
    {
      key: 'geolocation',
      label: 'Моё местоположение',
      children: <GeoSectionContent />,
    },
  ]

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>

      <ProfilePageWrapper>
        <ProfileCollapseWrapper>
          <Collapse
            defaultActiveKey={['profile']}
            items={collapseItems}
            accordion={false}
            bordered={false}
          />
        </ProfileCollapseWrapper>
      </ProfilePageWrapper>
    </div>
  )
}

export const initProfilePage = () => Promise.resolve()
