import type { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS, ERROR_MSG } from '../constants'

const YANDEX_AUTH_URL = 'https://ya-praktikum.tech/api/v2/auth/user'

const checkYandexAuth = async (cookie: string): Promise<boolean> => {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  try {
    const response = await fetch(YANDEX_AUTH_URL, {
      headers: {
        Cookie: cookie,
      },
      signal: controller.signal,
    })

    return response.ok
  } catch (e) {
    console.error('Yandex auth check failed', e)

    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cookie = req.headers.cookie

  if (!cookie) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: ERROR_MSG.NOT_AUTHORIZED })

    return
  }

  const authorized = await checkYandexAuth(cookie)

  if (!authorized) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: ERROR_MSG.NOT_AUTHORIZED })

    return
  }

  next()
}
