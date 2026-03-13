import { useState, useCallback } from 'react'

interface GeoPosition {
  latitude: number
  longitude: number
}

interface UseGeolocationReturn {
  coords: GeoPosition | null
  loading: boolean
  error: string | null
  status: string | null
  locate: () => void
}

const ERROR_MESSAGES: Record<number, string> = {
  1: 'Вы запретили доступ к геолокации',
  2: 'Информация о местоположении недоступна',
  3: 'Время запроса на определение местоположения истекло',
}

export function useGeolocation(
  options?: PositionOptions
): UseGeolocationReturn {
  const [coords, setCoords] = useState<GeoPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const locate = useCallback(() => {
    setCoords(null)
    setError(null)

    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером')
      return
    }

    setLoading(true)
    setStatus('Определяем местоположение…')

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setStatus(null)
        setLoading(false)
      },
      err => {
        setError(
          ERROR_MESSAGES[err.code] ?? 'Не удалось определить местоположение'
        )
        setStatus(null)
        setLoading(false)
      },
      options ?? {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [options])

  return { coords, loading, error, status, locate }
}
