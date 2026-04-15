import type { Request, Response } from 'express'
import { Reaction } from '../models/Reaction'
import { Comment } from '../models/Comment'
import { sanitize } from '../utils/sanitize'
import { HTTP_STATUS, ERROR_MSG } from '../constants'

/**
 * POST запрос на добавление reaction /api/v1/forum/comments/:commentId/reactions
 *
 */
export const createReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params
    const { type, userId } = req.body

    if (!type || !userId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.REACTION_REQUIRED_FIELDS })
      return
    }

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const existing = await Reaction.findOne({ where: { commentId, userId } })
    if (existing) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.REACTION_ALREADY_EXISTS })
      return
    }

    const reaction = await Reaction.create({
      type: sanitize(type),
      userId,
      commentId,
    })

    res.status(HTTP_STATUS.CREATED).json(reaction)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * PUT запрос на апдейт reaction /api/v1/forum/comments/:commentId/reactions
 *
 */
export const updateReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params
    const { type, userId } = req.body

    if (!type || !userId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.REACTION_REQUIRED_FIELDS })
      return
    }

    const reaction = await Reaction.findOne({ where: { commentId, userId } })
    if (!reaction) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.REACTION_NOT_FOUND })
      return
    }

    reaction.type = sanitize(type)
    await reaction.save()

    res.json(reaction)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * DELETE запрос на удаление reaction /api/v1/forum/comments/:commentId/reactions
 *
 */
export const deleteReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params
    const { userId } = req.body

    if (!userId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.REACTION_USER_REQUIRED })
      return
    }

    const reaction = await Reaction.findOne({ where: { commentId, userId } })
    if (!reaction) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.REACTION_NOT_FOUND })
      return
    }

    await reaction.destroy()
    res.json({ ok: true })
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}
