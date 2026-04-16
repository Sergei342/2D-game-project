import type { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS, ERROR_MSG, REACTION_TYPES } from '../constants'

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
