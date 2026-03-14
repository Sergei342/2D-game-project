import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { GeoSectionContent } from './GeoSection'
import { useGeolocation } from '../../hooks/useGeolocation'
import { COORD_ROUND_VALUE, OSM_BASE_URL, OSM_DEFAULT_ZOOM } from './consts'

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

  it('renders the locate button', () => {
    setupHook()
    render(<GeoSectionContent />)

    expect(
      screen.getByRole('button', { name: BUTTON_NAME })
    ).toBeInTheDocument()
  })

  it('calls locate on button click', async () => {
    const locate = jest.fn()
    setupHook({ locate })
    render(<GeoSectionContent />)

    await userEvent.click(screen.getByRole('button', { name: BUTTON_NAME }))

    expect(locate).toHaveBeenCalledTimes(1)
  })

  it('shows status when present and not loading', () => {
    setupHook({ status: 'Разрешение получено' })
    render(<GeoSectionContent />)

    expect(screen.getByText('Разрешение получено')).toBeInTheDocument()
  })

  it('hides status while loading', () => {
    setupHook({ status: 'Разрешение получено', loading: true })
    render(<GeoSectionContent />)

    expect(screen.queryByText('Разрешение получено')).not.toBeInTheDocument()
  })

  it('shows error message', () => {
    setupHook({ error: 'Геолокация недоступна' })
    render(<GeoSectionContent />)

    expect(screen.getByText('Геолокация недоступна')).toBeInTheDocument()
  })

  it('renders coords and map link when coords exist', () => {
    const coords = { latitude: 55.751244, longitude: 37.618423 }
    setupHook({ coords })
    render(<GeoSectionContent />)

    const lat = coords.latitude.toFixed(COORD_ROUND_VALUE)
    const lon = coords.longitude.toFixed(COORD_ROUND_VALUE)

    expect(screen.getByText(new RegExp(lat))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(lon))).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /посмотреть на карте/i })
    expect(link).toHaveAttribute(
      'href',
      `${OSM_BASE_URL}/#map=${OSM_DEFAULT_ZOOM}/${coords.latitude}/${coords.longitude}`
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render coords or error when absent', () => {
    setupHook()
    render(<GeoSectionContent />)

    expect(screen.queryByText(/широта/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/долгота/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
