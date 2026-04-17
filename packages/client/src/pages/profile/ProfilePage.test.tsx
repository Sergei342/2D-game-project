import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { message } from 'antd'

import userReducer from '../../slices/userSlice'
import { ProfilePage } from './ProfilePage'
import {
  profileService,
  UserProfile,
  UnauthorizedError,
} from './ProfileService'

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

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      friends: () => null as never,
      ssr: () => null as never,
      forum: () => null as never,
      game: () => null as never,
    },
  })

const renderPage = async () => {
  let view!: ReturnType<typeof render>

  await act(async () => {
    view = render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    )
  })

  return view
}

const expandPanel = async (name: RegExp) => {
  const user = userEvent.setup()
  const header = await screen.findByText(name)
  await user.click(header)
}

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    ;(profileService.getUser as jest.Mock).mockResolvedValue(FAKE_USER)
  })

  it('snapshot: loading state', async () => {
    const neverResolves = new Promise(() => {
      /* neverResolves - эмулирует состояние данные загружаются */
    })

    ;(profileService.getUser as jest.Mock).mockReturnValue(neverResolves)

    const { container } = await renderPage()

    expect(container).toMatchSnapshot()
  })

  it('snapshot: error when getUser returns null', async () => {
    ;(profileService.getUser as jest.Mock).mockResolvedValue(null)

    const { container } = await renderPage()

    expect(
      await screen.findByText('Не удалось загрузить данные профиля')
    ).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })

  it('snapshot: error when getUser rejects', async () => {
    ;(profileService.getUser as jest.Mock).mockRejectedValue(
      new Error('Сервер не отвечает')
    )

    const { container } = await renderPage()

    expect(await screen.findByText('Сервер не отвечает')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('renders loaded state with all sections and pre-filled data', async () => {
    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Иванов')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivanov')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ivan@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+71234567890')).toBeInTheDocument()

    expect(screen.getByText('Сменить пароль')).toBeInTheDocument()
    expect(screen.getByText('Моё местоположение')).toBeInTheDocument()
    expect(screen.getByText('Уведомления')).toBeInTheDocument()
  })

  it('navigates to /login when getUser throws UnauthorizedError', async () => {
    ;(profileService.getUser as jest.Mock).mockRejectedValue(
      new UnauthorizedError()
    )

    await renderPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    expect(message.error).toHaveBeenCalledWith(
      'Сессия истекла. Перенаправляем на страницу входа…'
    )
  })

  it('sets document title to "Профиль"', async () => {
    await renderPage()

    await waitFor(() => {
      expect(document.title).toBe('Профиль')
    })
  })

  it('calls profileService.updateProfile and shows success message on save', async () => {
    const updatedUser = { ...FAKE_USER, first_name: 'Пётр' }
    ;(profileService.updateProfile as jest.Mock).mockResolvedValue(updatedUser)

    const user = userEvent.setup()

    await renderPage()

    const firstNameInput = await screen.findByDisplayValue('Иван')
    await user.clear(firstNameInput)
    await user.type(firstNameInput, 'Пётр')

    const saveButton = await screen.findByRole('button', { name: /сохранить/i })
    await user.click(saveButton)

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

    const user = userEvent.setup()

    await renderPage()

    await screen.findByDisplayValue('Иван')

    const saveButton = await screen.findByRole('button', { name: /сохранить/i })
    await user.click(saveButton)

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

    const user = userEvent.setup()

    await renderPage()

    await screen.findByDisplayValue('Иван')

    const saveButton = await screen.findByRole('button', { name: /сохранить/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('calls profileService.changePassword on valid password submit', async () => {
    ;(profileService.changePassword as jest.Mock).mockResolvedValue(undefined)

    const user = userEvent.setup()

    await renderPage()

    expect(await screen.findByText('Сменить пароль')).toBeInTheDocument()

    await expandPanel(/Сменить пароль/)

    const oldPasswordInput = await screen.findByLabelText('Старый пароль')
    const newPasswordInput = await screen.findByLabelText('Новый пароль')

    await user.type(oldPasswordInput, 'oldPass123')
    await user.type(newPasswordInput, 'newPass456')
    await user.click(
      await screen.findByRole('button', { name: /изменить пароль/i })
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
  }, 15000)

  it('does not call changeAvatar when no file is selected', async () => {
    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()

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

    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()

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

    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()

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
    let resolveGetUser!: (v: UserProfile) => void
    ;(profileService.getUser as jest.Mock).mockImplementation(
      () =>
        new Promise<UserProfile>(resolve => {
          resolveGetUser = resolve
        })
    )

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())

    const { unmount } = await renderPage()

    expect(screen.getByText('Загрузка…')).toBeInTheDocument()

    unmount()

    await act(async () => {
      resolveGetUser(FAKE_USER)
    })

    consoleSpy.mockRestore()
  })

  it('passes correct avatarSrc from profileService.avatarUrl', async () => {
    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()
    expect(profileService.avatarUrl).toHaveBeenCalledWith('avatar.png')
  })

  it('passes default avatarSrc when user has no avatar', async () => {
    const userWithoutAvatar = { ...FAKE_USER, avatar: null }
    ;(profileService.getUser as jest.Mock).mockResolvedValue(userWithoutAvatar)

    await renderPage()

    expect(await screen.findByText('Профиль')).toBeInTheDocument()
    expect(profileService.avatarUrl).toHaveBeenCalledWith(null)
  })
})
