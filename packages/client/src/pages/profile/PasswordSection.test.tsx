import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Form } from 'antd'

import { PasswordSection } from './PasswordSection'

const PasswordSectionWrapper = ({
  onChangePassword,
}: {
  onChangePassword: (values: {
    oldPassword: string
    newPassword: string
  }) => void
}) => {
  const [form] = Form.useForm()
  return <PasswordSection form={form} onChangePassword={onChangePassword} />
}

const SUBMIT_BUTTON_NAME = /изменить пароль/i
const OLD_PASSWORD_LABEL = 'Старый пароль'
const OLD_PASSWORD_VALUE = 'oldPass123'
const NEW_PASSWORD_LABEL = 'Новый пароль'
const NEW_PASSWORD_VALUE = 'newPass456'
const PASSWORD_CHAR_5 = '12345'
const PASSWORD_CHAR_6 = '123456'

describe('PasswordSection', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  // TODO: проверить обноление
  // it('renders correctly', () => {
  //   const { container } = render(
  //     <PasswordSectionWrapper onChangePassword={jest.fn()} />
  //   )

  //   expect(container).toMatchSnapshot()
  // })

  it('calls onChangePassword with form values on valid submit', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_LABEL),
      OLD_PASSWORD_VALUE
    )
    await userEvent.type(
      screen.getByLabelText(NEW_PASSWORD_LABEL),
      NEW_PASSWORD_VALUE
    )
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(onChangePassword).toHaveBeenCalledTimes(1)
    })

    expect(onChangePassword).toHaveBeenCalledWith({
      oldPassword: OLD_PASSWORD_VALUE,
      newPassword: NEW_PASSWORD_VALUE,
    })
  })

  it('shows validation error when old password is empty', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.type(
      screen.getByLabelText(NEW_PASSWORD_LABEL),
      NEW_PASSWORD_VALUE
    )
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Введите текущий пароль')).toBeInTheDocument()
    })

    expect(onChangePassword).not.toHaveBeenCalled()
  })

  it('shows validation error when new password is empty', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_LABEL),
      OLD_PASSWORD_VALUE
    )
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Введите новый пароль')).toBeInTheDocument()
    })

    expect(onChangePassword).not.toHaveBeenCalled()
  })

  it('shows validation error when new password is shorter than 6 characters', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_LABEL),
      OLD_PASSWORD_VALUE
    )
    await userEvent.type(
      screen.getByLabelText(NEW_PASSWORD_LABEL),
      PASSWORD_CHAR_5
    )
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Минимум 6 символов')).toBeInTheDocument()
    })

    expect(onChangePassword).not.toHaveBeenCalled()
  })

  it('shows both validation errors when both fields are empty', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(screen.getByText('Введите текущий пароль')).toBeInTheDocument()
      expect(screen.getByText('Введите новый пароль')).toBeInTheDocument()
    })

    expect(onChangePassword).not.toHaveBeenCalled()
  })

  it('accepts new password with exactly 6 characters', async () => {
    const onChangePassword = jest.fn()
    render(<PasswordSectionWrapper onChangePassword={onChangePassword} />)

    await userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_LABEL),
      OLD_PASSWORD_VALUE
    )
    await userEvent.type(
      screen.getByLabelText(NEW_PASSWORD_LABEL),
      PASSWORD_CHAR_6
    )
    await userEvent.click(
      screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
    )

    await waitFor(() => {
      expect(onChangePassword).toHaveBeenCalledTimes(1)
    })

    expect(onChangePassword).toHaveBeenCalledWith({
      oldPassword: OLD_PASSWORD_VALUE,
      newPassword: PASSWORD_CHAR_6,
    })
  })
})
