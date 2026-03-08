import { useEffect, useState, useCallback, RefObject } from 'react'

interface FullscreenDocument extends Document {
  mozFullScreenElement?: Element | null
  webkitFullscreenElement?: Element | null
  msFullscreenElement?: Element | null
  mozCancelFullScreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface FullscreenHTMLElement extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>
  webkitRequestFullscreen?: (flag?: number) => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

const WEBKIT_ALLOW_KEYBOARD_INPUT = 1

const FULLSCREEN_CHANGE_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
] as const

const getFullscreenElement = (): Element | null => {
  const doc = document as FullscreenDocument
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  )
}

const toPromise = (result: Promise<void> | void): Promise<void> =>
  result ?? Promise.resolve()

const requestFullscreen = (elem: HTMLElement): Promise<void> => {
  const el = elem as FullscreenHTMLElement

  if (el.requestFullscreen) return el.requestFullscreen()
  if (el.webkitRequestFullscreen)
    return toPromise(el.webkitRequestFullscreen(WEBKIT_ALLOW_KEYBOARD_INPUT))
  if (el.mozRequestFullScreen) return toPromise(el.mozRequestFullScreen())
  if (el.msRequestFullscreen) return toPromise(el.msRequestFullscreen())

  return Promise.reject(new Error('Fullscreen API не поддерживается'))
}

const exitFullscreen = (): Promise<void> => {
  const doc = document as FullscreenDocument

  if (doc.exitFullscreen) return doc.exitFullscreen()
  if (doc.webkitExitFullscreen) return toPromise(doc.webkitExitFullscreen())
  if (doc.mozCancelFullScreen) return toPromise(doc.mozCancelFullScreen())
  if (doc.msExitFullscreen) return toPromise(doc.msExitFullscreen())

  return Promise.reject(new Error('Fullscreen API не поддерживается'))
}

export function useFullscreen(containerRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!getFullscreenElement())

    FULLSCREEN_CHANGE_EVENTS.forEach(evt =>
      document.addEventListener(evt, handleChange)
    )

    return () => {
      FULLSCREEN_CHANGE_EVENTS.forEach(evt =>
        document.removeEventListener(evt, handleChange)
      )
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current

    if (!container) return

    try {
      if (!getFullscreenElement()) {
        await requestFullscreen(container)
      } else {
        await exitFullscreen()
      }
    } catch (err) {
      console.error('Ошибка переключения полноэкранного режима:', err)
    }
  }, [containerRef])

  return { isFullscreen, toggleFullscreen }
}
