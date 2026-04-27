import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { NotificationSection } from './NotificationSection'
import { useNotification } from '../../hooks/useNotification'

jest.mock('../../hooks/useNotification')

const mockUseNotification = jest.mocked(useNotification)

const BASE_STATE: ReturnType<typeof useNotification> = {
  permission: 'default',
  enabled: true,
  requestPermission: jest.fn().mockResolvedValue('default'),
  toggleEnabled: jest.fn(),
  show: jest.fn(),
}

const setupHook = (
  overrides: Partial<ReturnType<typeof useNotification>> = {}
) => {
  mockUseNotification.mockReturnValue({ ...BASE_STATE, ...overrides })
}

describe('NotificationSection', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('calls requestPermission on button click', async () => {
    const requestPermission = jest.fn().mockResolvedValue('granted')
    setupHook({ requestPermission })
    render(<NotificationSection />)

    await userEvent.click(
      screen.getByRole('button', { name: /разрешить уведомления/i })
    )

    await waitFor(() => {
      expect(requestPermission).toHaveBeenCalledTimes(1)
    })
  })

  it('calls toggleEnabled on switch click', async () => {
    const toggleEnabled = jest.fn()
    setupHook({ permission: 'granted', enabled: true, toggleEnabled })
    render(<NotificationSection />)

    await userEvent.click(screen.getByRole('switch'))

    await waitFor(() => {
      expect(toggleEnabled).toHaveBeenCalledTimes(1)
    })
  })
})
