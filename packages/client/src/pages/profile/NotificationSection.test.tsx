import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { NotificationSection } from './NotificationSection'
import { useNotification } from '../../hooks/useNotification'

jest.mock('../../hooks/useNotification')

const mockUseNotification = jest.mocked(useNotification)

const BASE_STATE: ReturnType<typeof useNotification> = {
  permission: 'default',
  enabled: true,
  requestPermission: jest.fn(),
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

  it('renders default permission state with request button', () => {
    setupHook()
    const { container } = render(<NotificationSection />)

    expect(container).toMatchSnapshot()
  })

  it('calls requestPermission on button click', async () => {
    const requestPermission = jest.fn()
    setupHook({ requestPermission })
    render(<NotificationSection />)

    await userEvent.click(
      screen.getByRole('button', { name: /разрешить уведомления/i })
    )

    expect(requestPermission).toHaveBeenCalledTimes(1)
  })

  it('renders granted state with toggle and hint', () => {
    setupHook({ permission: 'granted', enabled: true })
    const { container } = render(<NotificationSection />)

    expect(container).toMatchSnapshot()
  })

  it('calls toggleEnabled on switch click', async () => {
    const toggleEnabled = jest.fn()
    setupHook({ permission: 'granted', enabled: true, toggleEnabled })
    render(<NotificationSection />)

    await userEvent.click(screen.getByRole('switch'))

    expect(toggleEnabled).toHaveBeenCalledTimes(1)
  })

  it('renders denied state with disabled button and error hint', () => {
    setupHook({ permission: 'denied' })
    const { container } = render(<NotificationSection />)

    expect(container).toMatchSnapshot()
  })
})
