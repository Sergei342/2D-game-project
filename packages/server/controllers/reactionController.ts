import type { Request, Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import { Reaction } from '../models/Reaction'
import { Comment } from '../models/Comment'
import { HTTP_STATUS, ERROR_MSG, REACTION_TYPES } from '../constants'

/**
 * POST запрос на добавление reaction /api/v1/forum/comments/:commentId/reactions
 */
export const createReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)
    const { type, userId } = req.body

    if (!type || !REACTION_TYPES.includes(type)) {
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

    const reaction = await Reaction.create({
      type,
      userId,
      commentId,
    })

    res.status(HTTP_STATUS.CREATED).json(reaction)
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.REACTION_ALREADY_EXISTS })
      return
    }
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * PUT запрос на апдейт reaction /api/v1/forum/comments/:commentId/reactions
 */
export const updateReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)
    const { type, userId } = req.body

    if (!type || !REACTION_TYPES.includes(type)) {
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

    reaction.type = type
    await reaction.save()

    res.json(reaction)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * DELETE запрос на удаление reaction /api/v1/forum/comments/:commentId/reactions
 */
export const deleteReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)
    const { userId } = req.body

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
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}
