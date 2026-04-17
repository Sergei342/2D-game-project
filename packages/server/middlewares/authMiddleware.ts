import type { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS, ERROR_MSG } from '../constants'

/**
 * TODO: реализовать проверку авторизации
 *
 * Пока что middleware пропускает все запросы (заглушка), сделано,
 * чтобы закрыть ручки пока не сделана задача по мидлвари
 */
export function authMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const STUB_MODE = true

  if (STUB_MODE) {
    next()
    return
  }

  res.status(HTTP_STATUS.FORBIDDEN).json({ error: ERROR_MSG.NOT_AUTHORIZED })
}
