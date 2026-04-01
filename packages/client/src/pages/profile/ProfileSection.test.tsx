import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Form } from 'antd'

import { ProfileSection } from './ProfileSection'

const ProfileSectionWrapper = ({
  avatarSrc = null,
  saving = false,
  onSave = jest.fn(),
  onAvatarChange = jest.fn(),
}: {
  avatarSrc?: string | null
  saving?: boolean
  onSave?: (values: Record<string, string>) => void
  onAvatarChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const [form] = Form.useForm()
  return (
    <ProfileSection
      avatarSrc={avatarSrc}
      form={form}
      saving={saving}
      onSave={onSave}
      onAvatarChange={onAvatarChange}
    />
  )
}

const SUBMIT_BUTTON_NAME = /сохранить/i
const FIRST_NAME_LABEL = 'Имя'
const SECOND_NAME_LABEL = 'Фамилия'
const DISPLAY_NAME_LABEL = 'Отображаемое имя'
const LOGIN_LABEL = 'Логин'
const EMAIL_LABEL = 'Почта'
const PHONE_LABEL = 'Телефон'

const VALID_VALUES = {
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'ivanko',
  login: 'ivan123',
  email: 'ivan@example.com',
  phone: '+79991234567',
}

const fillForm = async () => {
  await userEvent.type(
    screen.getByLabelText(FIRST_NAME_LABEL),
    VALID_VALUES.first_name
  )
  await userEvent.type(
    screen.getByLabelText(SECOND_NAME_LABEL),
    VALID_VALUES.second_name
  )
  await userEvent.type(
    screen.getByLabelText(DISPLAY_NAME_LABEL),
    VALID_VALUES.display_name
  )
  await userEvent.type(screen.getByLabelText(LOGIN_LABEL), VALID_VALUES.login)
  await userEvent.type(screen.getByLabelText(EMAIL_LABEL), VALID_VALUES.email)
  await userEvent.type(screen.getByLabelText(PHONE_LABEL), VALID_VALUES.phone)
}

describe('ProfileSection', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('renders default state', () => {
    const { container } = render(<ProfileSectionWrapper />)

    expect(container).toMatchSnapshot()
  })

  it('renders with avatar src', () => {
    const { container } = render(
      <ProfileSectionWrapper avatarSrc="https://example.com/avatar.jpg" />
    )

    expect(container).toMatchSnapshot()
  })

  it('renders with saving state', () => {
    const { container } = render(<ProfileSectionWrapper saving={true} />)

    expect(container).toMatchSnapshot()
  })

  it('calls onSave with form values on valid submit', async () => {
    const onSave = jest.fn()
    render(<ProfileSectionWrapper onSave={onSave} />)

    await fillForm()
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    expect(onSave).toHaveBeenCalledWith(VALID_VALUES)
  }, 15000)

  it('shows all required validation errors when all fields are empty', async () => {
    const onSave = jest.fn()
    render(<ProfileSectionWrapper onSave={onSave} />)

    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Введите имя')).toBeInTheDocument()
      expect(screen.getByText('Введите фамилию')).toBeInTheDocument()
      expect(screen.getByText('Введите логин')).toBeInTheDocument()
      expect(screen.getByText('Введите почту')).toBeInTheDocument()
      expect(screen.getByText('Введите телефон')).toBeInTheDocument()
    })

    expect(onSave).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid email format', async () => {
    const onSave = jest.fn()
    render(<ProfileSectionWrapper onSave={onSave} />)

    await userEvent.type(
      screen.getByLabelText(FIRST_NAME_LABEL),
      VALID_VALUES.first_name
    )
    await userEvent.type(
      screen.getByLabelText(SECOND_NAME_LABEL),
      VALID_VALUES.second_name
    )
    await userEvent.type(screen.getByLabelText(LOGIN_LABEL), VALID_VALUES.login)
    await userEvent.type(screen.getByLabelText(EMAIL_LABEL), 'not-an-email')
    await userEvent.type(screen.getByLabelText(PHONE_LABEL), VALID_VALUES.phone)
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Некорректный email')).toBeInTheDocument()
    })

    expect(onSave).not.toHaveBeenCalled()
  }, 15000)

  it('submits successfully without display_name', async () => {
    const onSave = jest.fn()
    render(<ProfileSectionWrapper onSave={onSave} />)

    await userEvent.type(
      screen.getByLabelText(FIRST_NAME_LABEL),
      VALID_VALUES.first_name
    )
    await userEvent.type(
      screen.getByLabelText(SECOND_NAME_LABEL),
      VALID_VALUES.second_name
    )
    await userEvent.type(screen.getByLabelText(LOGIN_LABEL), VALID_VALUES.login)
    await userEvent.type(screen.getByLabelText(EMAIL_LABEL), VALID_VALUES.email)
    await userEvent.type(screen.getByLabelText(PHONE_LABEL), VALID_VALUES.phone)
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    expect(onSave).toHaveBeenCalledWith({
      first_name: VALID_VALUES.first_name,
      second_name: VALID_VALUES.second_name,
      login: VALID_VALUES.login,
      email: VALID_VALUES.email,
      phone: VALID_VALUES.phone,
    })
  })
})
