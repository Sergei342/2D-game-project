import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { GeoSectionContent } from './GeoSection'
import { useGeolocation } from '../../hooks/useGeolocation'

jest.mock('../../hooks/useGeolocation')

const mockUseGeolocation = jest.mocked(useGeolocation)

const BUTTON_NAME = /определить местоположение/i

const BASE_STATE = {
  coords: null,
  loading: false,
  error: null,
  status: null,
  locate: jest.fn(),
}

const setupHook = (
  overrides: Partial<ReturnType<typeof useGeolocation>> = {}
) => {
  mockUseGeolocation.mockReturnValue({ ...BASE_STATE, ...overrides })
}

describe('GeoSectionContent', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('calls locate on button click', async () => {
    const locate = jest.fn()
    setupHook({ locate })
    render(<GeoSectionContent />)

    await userEvent.click(screen.getByRole('button', { name: BUTTON_NAME }))

    expect(locate).toHaveBeenCalledTimes(1)
  })
})
