import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { HTTP_STATUS, ERROR_MSG, REACTION_TYPES } from '../constants'

function isValidPositiveInt(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  const n = Number(value)

  return Number.isInteger(n) && n >= 1
}

export function isValidText(
  value: unknown,
  min: number,
  max: number
): value is string {
  if (typeof value !== 'string') {
    return false
  }

  const len = value.trim().length

  return len >= min && len <= max
}

export function validateIdParam(paramName: string): RequestHandler {
  return (req, res, next) => {
    const value = Number(req.params[paramName])

    if (!Number.isInteger(value) || value < 1) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: `Invalid ${paramName}` })
      return
    }

    next()
  }
}

export function validatePagination(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!isValidPositiveInt(req.query.page)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MSG.INVALID_PAGE })
    return
  }

  if (!isValidPositiveInt(req.query.pageSize)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MSG.INVALID_PAGE_SIZE })
    return
  }

  next()
}

export function validateReactionParams(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const commentId = Number(req.params.commentId)

  if (!Number.isInteger(commentId) || commentId < 1) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MSG.COMMENT_INVALID_ID })
    return
  }

  const { type, userId } = req.body

  if (!userId) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MSG.REACTION_USER_REQUIRED })
    return
  }

  //type !== undefined чтобы не валилось на операции delete
  if (type !== undefined && !REACTION_TYPES.includes(type)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MSG.REACTION_INVALID_TYPE })
    return
  }

  next()
}
