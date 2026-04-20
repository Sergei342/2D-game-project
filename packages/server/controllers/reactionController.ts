import type { Request, Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import { Reaction } from '../models/Reaction'
import { Comment } from '../models/Comment'
import { HTTP_STATUS, ERROR_MSG, REACTION_TYPES } from '../constants'

// TODO: после реализации authMiddleware брать userId из req.user.id, не из body

/**
 * GET запрос на получение реакций комментария /api/v1/forum/comments/:commentId/reactions
 *
 * Возвращает плоский список реакций. Реакции также встроены в ответ getComments,
 * но отдельный endpoint полезен для точечного обновления UI без перезагрузки дерева комментариев.
 */
export const getReactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const reactions = await Reaction.findAll({ where: { commentId } })
    res.json(reactions)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * POST запрос на добавление reaction /api/v1/forum/comments/:commentId/reactions
 *
 * Один пользователь — одна реакция на комментарий (уникальность по commentId + userId).
 * Если реакция уже существует — 400 REACTION_ALREADY_EXISTS.
 */
export const createReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)
    const { type, userId } = req.body

    // validateReactionParams проверяет тип если он передан, но не проверяет его наличие.
    // Для POST тип обязателен, поэтому проверяем явно в контроллере.
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
 *
 * Меняет тип существующей реакции пользователя (например, 👍 → ❤️).
 * Находит реакцию по паре commentId + userId — у пользователя всегда не более одной реакции на комментарий.
 */
export const updateReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = Number(req.params.commentId)
    const { type, userId } = req.body

    // validateReactionParams проверяет тип если он передан, но не проверяет его наличие.
    // Для PUT тип обязателен, поэтому проверяем явно в контроллере.
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
 *
 * Удаляет реакцию текущего пользователя на комментарий.
 * userId передаётся в теле запроса (до реализации authMiddleware).
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
