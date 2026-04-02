import { useState, useCallback } from 'react'

export type PermissionState = NotificationPermission | 'unsupported'

const UNSUPPORTED = 'unsupported'
const NOTIFICATION_ENABLED_KEY = 'notifications_enabled'

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

function getPermission(): PermissionState {
  return isSupported() ? Notification.permission : UNSUPPORTED
}

function loadEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIFICATION_ENABLED_KEY) !== 'false'
  } catch {
    return true
  }
}

export function useNotification() {
  const [permission, setPermission] = useState<PermissionState>(getPermission)
  const [enabled, setEnabled] = useState(loadEnabled)

  const requestPermission = async (): Promise<PermissionState> => {
    if (!isSupported()) return UNSUPPORTED

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const toggleEnabled = (value: boolean) => {
    setEnabled(value)
    localStorage.setItem(NOTIFICATION_ENABLED_KEY, String(value))
  }

  const show = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (
        permission !== 'granted' ||
        !enabled ||
        document.visibilityState === 'visible'
      ) {
        return null
      }

      const notification = new Notification(title, {
        icon: '/game-graphic/space-invader.webp',
        ...options,
      })

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
