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

  it('renders initial state with button, no coords and no error', () => {
    setupHook()
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })

  it('calls locate on button click', async () => {
    const locate = jest.fn()
    setupHook({ locate })
    render(<GeoSectionContent />)

    await userEvent.click(screen.getByRole('button', { name: BUTTON_NAME }))

    expect(locate).toHaveBeenCalledTimes(1)
  })

  it('shows loading state without status', () => {
    setupHook({ loading: true })
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })

  it('shows status when present and not loading', () => {
    setupHook({ status: 'Разрешение получено' })
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })

  it('hides status while loading even if status exists', () => {
    setupHook({ status: 'Разрешение получено', loading: true })
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })

  it('shows error message', () => {
    setupHook({ error: 'Геолокация недоступна' })
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })

  it('renders coords and map link when coords exist', () => {
    const coords = { latitude: 55.751244, longitude: 37.618423 }
    setupHook({ coords })
    const { container } = render(<GeoSectionContent />)

    expect(container).toMatchSnapshot()
  })
})
