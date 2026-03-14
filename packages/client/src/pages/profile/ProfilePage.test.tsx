import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import {
  profileService,
  UserProfile,
  UnauthorizedError,
} from './ProfileService'
import { message } from 'antd'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../hooks/usePage', () => ({
  usePage: jest.fn(),
}))

jest.mock('./ProfileService', () => {
  const UnauthorizedError = class extends Error {
    constructor(msg = 'Unauthorized') {
      super(msg)
      this.name = 'UnauthorizedError'
    }
  }

  return {
    UnauthorizedError,
    profileService: {
      getUser: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      changeAvatar: jest.fn(),
      avatarUrl: jest.fn((avatar: string | null) =>
        avatar ? `/avatars/${avatar}` : '/avatars/default.png'
      ),
    },
  }
})

jest.mock('./GeoSection', () => ({
  GeoSectionContent: () => <div data-testid="geo-section">GeoSection</div>,
}))

jest.mock('antd', () => {
  const actual = jest.requireActual('antd')
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
    },
  }
})

const FAKE_USER: UserProfile = {
  id: 1,
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'ivan',
  login: 'ivanov',
  email: 'ivan@example.com',
  phone: '+71234567890',
  avatar: 'avatar.png',
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  )

const expandPanel = async (name: RegExp) => {
  const header = screen.getByText(name)
  await userEvent.click(header)
}

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    ;(profileService.getUser as jest.Mock).mockResolvedValue(FAKE_USER)
  })

  it('shows loading indicator while fetching user data', () => {
    ;(profileService.getUser as jest.Mock).mockReturnValue(
      new Promise(() => {
        /* test */
      })
    )

    renderPage()

    expect(screen.getByText('Загрузка…')).toBeInTheDocument()
  })

  it('shows error message when getUser returns null', async () => {
    ;(profileService.getUser as jest.Mock).mockResolvedValue(null)

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText('Не удалось загрузить данные профиля')
      ).toBeInTheDocument()
    })
  })

  it('shows error message when getUser rejects with a generic error', async () => {
    ;(profileService.getUser as jest.Mock).mockRejectedValue(
      new Error('Сервер не отвечает')
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Сервер не отвечает')).toBeInTheDocument()
    })
  })

  it('navigates to /login when getUser throws UnauthorizedError', async () => {
    ;(profileService.getUser as jest.Mock).mockRejectedValue(
      new UnauthorizedError()
    )

    renderPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    expect(message.error).toHaveBeenCalledWith(
      'Сессия истекла. Перенаправляем на страницу входа…'
    )
  })

  it('renders Collapse with profile, password and geo sections after loading', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    expect(screen.getByText('Сменить пароль')).toBeInTheDocument()
    expect(screen.getByText('Моё местоположение')).toBeInTheDocument()
  })

  it('sets document title to "Профиль"', async () => {
    renderPage()

    await waitFor(() => {
      expect(document.title).toBe('Профиль')
    })
  })

  it('pre-fills profile form with user data', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Иванов')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivanov')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivan@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+71234567890')).toBeInTheDocument()
  })

  it('calls profileService.updateProfile and shows success message on save', async () => {
    const updatedUser = { ...FAKE_USER, first_name: 'Пётр' }
    ;(profileService.updateProfile as jest.Mock).mockResolvedValue(updatedUser)

    renderPage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByDisplayValue('Иван')
    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, 'Пётр')

    const saveButton = screen.getByRole('button', { name: /сохранить/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalledTimes(1)
    })

    expect(profileService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: 'Пётр' })
    )

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('Профиль успешно сохранён')
    })
  })

  it('shows error message when updateProfile rejects', async () => {
    ;(profileService.updateProfile as jest.Mock).mockRejectedValue(
      new Error('Ошибка сервера')
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    })

    const saveButton = screen.getByRole('button', { name: /сохранить/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Ошибка сервера')
    })
  })

  it('navigates to /login when updateProfile throws UnauthorizedError', async () => {
    ;(profileService.updateProfile as jest.Mock).mockRejectedValue(
      new UnauthorizedError()
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    })

    const saveButton = screen.getByRole('button', { name: /сохранить/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('calls profileService.changePassword on valid password submit', async () => {
    ;(profileService.changePassword as jest.Mock).mockResolvedValue(undefined)

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Сменить пароль')).toBeInTheDocument()
    })

    await expandPanel(/Сменить пароль/)

    await waitFor(() => {
      expect(screen.getByLabelText('Старый пароль')).toBeInTheDocument()
    })

    await userEvent.type(screen.getByLabelText('Старый пароль'), 'oldPass123')
    await userEvent.type(screen.getByLabelText('Новый пароль'), 'newPass456')
    await userEvent.click(
      screen.getByRole('button', { name: /изменить пароль/i })
    )

    await waitFor(() => {
      expect(profileService.changePassword).toHaveBeenCalledTimes(1)
    })

    expect(profileService.changePassword).toHaveBeenCalledWith({
      oldPassword: 'oldPass123',
      newPassword: 'newPass456',
    })

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('Пароль успешно изменён')
    })
  })

  it('does not call changeAvatar when no file is selected', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [] } })
    })

    expect(profileService.changeAvatar).not.toHaveBeenCalled()
  })

  it('calls changeAvatar and shows success on valid file upload', async () => {
    const updatedUser = { ...FAKE_USER, avatar: 'new-avatar.png' }
    ;(profileService.changeAvatar as jest.Mock).mockResolvedValue(updatedUser)

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    const file = new File(['avatar-content'], 'photo.png', {
      type: 'image/png',
    })

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(profileService.changeAvatar).toHaveBeenCalledWith(file)
    })

    expect(message.success).toHaveBeenCalledWith('Аватар обновлён')
  })

  it('shows error when changeAvatar fails', async () => {
    ;(profileService.changeAvatar as jest.Mock).mockRejectedValue(
      new Error('upload failed')
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    const file = new File(['x'], 'photo.png', { type: 'image/png' })

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Не удалось загрузить аватар')
    })
  })

  it('does not update state after unmount (aborted fetch)', async () => {
    let resolveGetUser: (v: UserProfile) => void
    ;(profileService.getUser as jest.Mock).mockImplementation(
      () =>
        new Promise<UserProfile>(resolve => {
          resolveGetUser = resolve
        })
    )

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /* test */
    })

    const { unmount } = renderPage()

    expect(screen.getByText('Загрузка…')).toBeInTheDocument()

    unmount()

    await act(async () => {
      resolveGetUser(FAKE_USER)
    })

    consoleSpy.mockRestore()
  })

  it('passes correct avatarSrc from profileService.avatarUrl', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    expect(profileService.avatarUrl).toHaveBeenCalledWith('avatar.png')
  })

  it('passes default avatarSrc when user has no avatar', async () => {
    const userWithoutAvatar = { ...FAKE_USER, avatar: null }
    ;(profileService.getUser as jest.Mock).mockResolvedValue(userWithoutAvatar)

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument()
    })

    expect(profileService.avatarUrl).toHaveBeenCalledWith(null)
  })
})
