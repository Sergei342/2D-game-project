import type { Request, Response, NextFunction } from 'express'
import https from 'https'
import { HTTP_STATUS, ERROR_MSG } from '../constants'

const YANDEX_AUTH_URL = 'https://ya-praktikum.tech/api/v2/auth/user'

function checkYandexAuth(cookie: string): Promise<boolean> {
  return new Promise(resolve => {
    const req = https.get(
      YANDEX_AUTH_URL,
      { headers: { Cookie: cookie } },
      res => resolve(res.statusCode === 200)
    )
    req.on('error', () => resolve(false))
  })
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorized = await checkYandexAuth(req.headers.cookie ?? '')

  if (authorized) {
    next()
    return
  }

  res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: ERROR_MSG.NOT_AUTHORIZED })
}
