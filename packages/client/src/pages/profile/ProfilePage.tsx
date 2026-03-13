import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { usePage } from '../../hooks/usePage'
import { useCallback, useEffect, useState } from 'react'
import {
  profileService,
  UserProfile,
  UnauthorizedError,
} from './ProfileService'

import { MAX_AVATAR_SIZE, MAX_AVATAR_SIZE_MB_UNITS } from './consts'
import { PageInitArgs } from '../../routes/types'
import { Form, message, Collapse } from 'antd'
import { useDispatch } from '../../store'
import { setUser } from '../../slices/userSlice'

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
  const dispatch = useDispatch()

  const [user, setLocalUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  const handleUnauthorized = useCallback(() => {
    message.error('Сессия истекла. Перенаправляем на страницу входа…')
    navigate('/login')
  }, [navigate])

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

        setLocalUser(data)

        dispatch(
          setUser({
            name: data.first_name,
            secondName: data.second_name,
          })
        )

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
        if (controller.signal.aborted) return

        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
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
  }, [form, handleUnauthorized, dispatch])

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
        setLocalUser(updated)
        message.success('Аватар обновлён')
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }
        message.error('Не удалось загрузить аватар')
      } finally {
        input.value = ''
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

        setLocalUser(updated)

        dispatch(
          setUser({
            name: updated.first_name,
            secondName: updated.second_name,
          })
        )

        message.success('Профиль успешно сохранён')
      } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized()
          return
        }

        const errorMessage =
          err instanceof Error ? err.message : 'Не удалось сохранить профиль'

        setError(errorMessage)
        message.error(errorMessage)
      } finally {
        setSaving(false)
      }
    },
    [handleUnauthorized, dispatch]
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

export const initProfilePage = async (_args: PageInitArgs) => {
  // Заглушка для инициализации страницы профиля
}
