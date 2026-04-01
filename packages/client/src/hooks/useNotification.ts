import { useState, useCallback } from 'react'
import { message } from 'antd'

export type PermissionState = NotificationPermission | 'unsupported'

const UNSUPPORTED = 'unsupported'
const STORAGE_KEY = 'notifications_enabled'

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

function getPermission(): PermissionState {
  return isSupported() ? Notification.permission : UNSUPPORTED
}

function loadEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export function useNotification() {
  const [permission, setPermission] = useState<PermissionState>(getPermission)
  const [enabled, setEnabled] = useState(loadEnabled)

  const requestPermission = useCallback(async (): Promise<PermissionState> => {
    if (!isSupported()) return UNSUPPORTED

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  const toggleEnabled = useCallback((value: boolean) => {
    setEnabled(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      message.warning('Не удалось сохранить настройку уведомлений')
    }
  }, [])

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
