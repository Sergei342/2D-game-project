import { BASE_URL, HttpStatus } from '@/shared/constants'
import {
  profileService,
  UnauthorizedError,
  UserProfile,
} from './ProfileService'

const mockUser: UserProfile = {
  id: 1,
  first_name: 'Иван',
  second_name: 'Петров',
  display_name: 'ivan',
  login: 'ivanp',
  avatar: '/path/to/avatar.png',
  email: 'ivan@example.com',
  phone: '+79991234567',
}

describe('test ProfileService', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  const mockFetch = (body: unknown, status = HttpStatus.Success, ok = true) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok,
      status,
      text: () => Promise.resolve(JSON.stringify(body)),
      json: () => Promise.resolve(body),
    }) as jest.Mock
  }

  describe('test avatarUrl', () => {
    it('return full path if has result', () => {
      const result = profileService.avatarUrl('/some/path.png')

      expect(result).toBe(`${BASE_URL}/resources/some/path.png`)
    })

    it('return null if null url', () => {
      expect(profileService.avatarUrl(null)).toBeNull()
    })
  })

  describe('test getUser', () => {
    it('test request /auth/user and profile data', async () => {
      mockFetch(mockUser)

      const result = await profileService.getUser()

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/user`,
        expect.objectContaining({ credentials: 'include' })
      )
      expect(result).toEqual(mockUser)
    })

    it('test request contains abort signal', async () => {
      mockFetch(mockUser)

      const controller = new AbortController()

      await profileService.getUser({ signal: controller.signal })

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/user`,
        expect.objectContaining({ signal: controller.signal })
      )
    })

    it('test UnauthorizedError', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: HttpStatus.Unauthorized,
        json: () => Promise.resolve({ reason: 'Не авторизован' }),
      }) as jest.Mock

      await expect(profileService.getUser()).rejects.toThrow(UnauthorizedError)
    })

    it('test if server error', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: HttpStatus.ServerError,
        json: () => Promise.resolve({ reason: 'Error 500' }),
      }) as jest.Mock

      await expect(profileService.getUser()).rejects.toThrow('Error 500')
    })

    it('test unknown error invalid json', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: HttpStatus.ServerError,
        json: () => Promise.reject(new Error('invalid json')),
      }) as jest.Mock

      await expect(profileService.getUser()).rejects.toThrow(
        'Неизвестная ошибка'
      )
    })
  })

  describe('updateProfile', () => {
    it('updateProfile check new data', async () => {
      const updateData = {
        first_name: 'Иван',
        second_name: 'Петров',
        display_name: 'ivan',
        login: 'ivanpNew',
        email: 'newemail@example.com',
        phone: '+79991234567',
      }

      const updatedUser: UserProfile = {
        ...mockUser,
        login: 'ivanpNew',
        email: 'newemail@example.com',
      }

      mockFetch(updatedUser)

      const result = await profileService.updateProfile(updateData)

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/user/profile`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      )

      expect(result).toEqual(updatedUser)
    })
  })

  describe('test changePassword', () => {
    it('test request put /user/password', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: HttpStatus.Success,
        text: () => Promise.resolve('OK'),
      }) as jest.Mock

      await expect(
        profileService.changePassword({
          oldPassword: 'old123',
          newPassword: 'new456',
        })
      ).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/user/password`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldPassword: 'old123',
            newPassword: 'new456',
          }),
        })
      )
    })
  })

  describe('changeAvatar', () => {
    it('test request put /user/profile/avatar with FormData', async () => {
      mockFetch(mockUser)

      const file = new File(['bytes'], 'avatar.png', { type: 'image/png' })
      const result = await profileService.changeAvatar(file)

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/user/profile/avatar`,
        expect.objectContaining({
          method: 'PUT',
        })
      )

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1]

      expect(callArgs.body).toBeInstanceOf(FormData)
      expect(callArgs.body.get('avatar')).toEqual(file)
      expect(result).toEqual(mockUser)
    })
  })
})
