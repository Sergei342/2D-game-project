import { useState, useCallback, useEffect } from 'react'

export type PermissionState = NotificationPermission | 'unsupported'

export interface ShowOptions extends NotificationOptions {
  skipIfVisible?: boolean
}

const UNSUPPORTED = 'unsupported' as const
const NOTIFICATION_ENABLED_KEY = 'notifications_enabled'

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

function getPermission(): PermissionState {
  return isSupported() ? Notification.permission : UNSUPPORTED
}

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage
}

function loadEnabled(): boolean {
  if (!hasLocalStorage()) return true
  try {
    return localStorage.getItem(NOTIFICATION_ENABLED_KEY) !== 'false'
  } catch {
    return true
  }
}

export function useNotification() {
  const [permission, setPermission] = useState<PermissionState>(getPermission)
  const [enabled, setEnabled] = useState(loadEnabled)

  useEffect(() => {
    if (!isSupported() || !navigator.permissions) return

    let cancelled = false
    let removeListener: (() => void) | undefined

    navigator.permissions
      .query({ name: 'notifications' as PermissionName })
      .then(status => {
        if (cancelled) return
        const onChange = () => setPermission(getPermission())
        status.addEventListener('change', onChange)
        removeListener = () => status.removeEventListener('change', onChange)
      })
      .catch((err: unknown) => {
        console.warn(
          'Не удалось подписаться на изменения разрешений уведомлений',
          err
        )
      })

    return () => {
      cancelled = true
      removeListener?.()
    }
  }, [])

  const requestPermission = async (): Promise<PermissionState> => {
    if (!isSupported()) return UNSUPPORTED

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch {
      const current = getPermission()
      setPermission(current)
      return current
    }
  }

  const toggleEnabled = (value: boolean) => {
    setEnabled(value)
    if (hasLocalStorage()) {
      try {
        localStorage.setItem(NOTIFICATION_ENABLED_KEY, String(value))
      } catch (err) {
        console.warn('Не удалось сохранить настройку уведомлений', err)
      }
    }
  }

  const show = useCallback(
    (title: string, options?: ShowOptions) => {
      const { skipIfVisible = true, ...notificationOptions } = options ?? {}

      if (permission !== 'granted' || !enabled) return null

      if (
        skipIfVisible &&
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible'
      ) {
        return null
      }

      const notification = new Notification(title, notificationOptions)

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return notification
    },
    [permission, enabled]
  )

  return { permission, enabled, requestPermission, toggleEnabled, show }
}
