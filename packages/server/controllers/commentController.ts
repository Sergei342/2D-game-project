import type { Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { Comment } from '../models/Comment'
import { Topic } from '../models/Topic'
import { UserProfile } from '../models/UserProfile'
import { Reaction } from '../models/Reaction'
import { sanitize } from '../utils/sanitize'
import { updateUserProfile } from '../utils/userProfileUtils'
import {
  HTTP_STATUS,
  ERROR_MSG,
  COMMENT_TEXT_MIN_LENGTH,
  COMMENT_TEXT_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
} from '../constants'
import { isValidText } from '../middlewares/forumValidators'
import type { CommentNodeDTO } from '../types/dto'

/**
 * GET запрос на получение комментариев к топику
 * /api/v1/forum/topics/:topicId/comments
 *
 */
export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topicId = Number(req.params.topicId)

    const topic = await Topic.findByPk(topicId)
    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    const comments = await Comment.findAll({
      where: { topicId },
      include: [
        {
          model: UserProfile,
          as: 'author',
          attributes: ['id', 'displayName', 'avatar'],
        },
        { model: Reaction, attributes: ['id', 'type', 'userId'] },
      ],
      order: [['createdAt', 'ASC']],
    })

    res.json(buildCommentTree(comments))
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * POST запрос на создание комментария к топику
 * /api/v1/forum/topics/:topicId/comments
 *
 */
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topicId = Number(req.params.topicId)
    // TODO: после реализации authMiddleware брать authorId из req.user.id, не из body
    const { text, authorId, displayName, avatar, parentId } = req.body

    if (!authorId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.COMMENT_REQUIRED_FIELDS })
      return
    }

    if (!isValidText(text, COMMENT_TEXT_MIN_LENGTH, COMMENT_TEXT_MAX_LENGTH)) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_COMMENT_TEXT })
      return
    }

    if (
      !isValidText(
        displayName,
        DISPLAY_NAME_MIN_LENGTH,
        DISPLAY_NAME_MAX_LENGTH
      )
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_DISPLAY_NAME })
      return
    }

    const topic = await Topic.findByPk(topicId)
    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    if (parentId) {
      const parent = await Comment.findByPk(parentId)
      if (!parent || parent.topicId !== topicId) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ error: ERROR_MSG.COMMENT_PARENT_NOT_FOUND })
        return
      }
    }

    await updateUserProfile(authorId, sanitize(displayName), avatar)

    const created = await Comment.create({
      text: sanitize(text),
      authorId,
      topicId,
      parentId: parentId ?? null,
    })

    const comment = await Comment.findByPk(created.id, {
      include: [
        {
          model: UserProfile,
          as: 'author',
          attributes: ['id', 'displayName', 'avatar'],
        },
        { model: Reaction, attributes: ['id', 'type', 'userId'] },
      ],
    })

    res.status(HTTP_STATUS.CREATED).json(comment)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * PUT запрос на обновление комментария к топику
 * /api/v1/forum/comments/:id
 *
 */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const comment = await Comment.findByPk(id)

    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const { text } = req.body

    if (!isValidText(text, COMMENT_TEXT_MIN_LENGTH, COMMENT_TEXT_MAX_LENGTH)) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_COMMENT_TEXT })
      return
    }

    comment.text = sanitize(text)
    await comment.save()

    res.json(comment)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

/**
 * DELETE запрос на удаление комментария (каскадное удаление)
 * /api/v1/forum/comments/:id
 *
 */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const comment = await Comment.findByPk(id)

    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const allIds = await collectDescendantIds(comment.id)

    if (!Comment.sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    await Comment.sequelize.transaction(async transaction => {
      await Reaction.destroy({ where: { commentId: allIds }, transaction })
      await Comment.destroy({ where: { id: allIds }, transaction })
    })

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}

function formatComment(comment: Comment): CommentNodeDTO {
  return {
    id: comment.id,
    text: comment.text,
    authorId: comment.authorId,
    author: comment.author
      ? {
          id: comment.author.id,
          displayName: comment.author.displayName,
          avatar: comment.author.avatar,
        }
      : undefined,
    topicId: comment.topicId,
    parentId: comment.parentId,
    reactions: (comment.reactions ?? []).map(reaction => ({
      id: reaction.id,
      type: reaction.type,
      userId: reaction.userId,
    })),
    replies: [],
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  }
}

function buildCommentTree(comments: Comment[]): CommentNodeDTO[] {
  const nodeMap = new Map<number, CommentNodeDTO>()

  comments.forEach(comment => {
    nodeMap.set(comment.id, formatComment(comment))
  })

  const roots: CommentNodeDTO[] = []

  comments.forEach(comment => {
    const node = nodeMap.get(comment.id)
    if (!node) {
      return
    }

    const parent = comment.parentId !== null && nodeMap.get(comment.parentId)

    if (parent) {
      parent.replies.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

async function collectDescendantIds(rootId: number): Promise<number[]> {
  if (!Comment.sequelize) {
    throw new Error('Sequelize instance is not available')
  }

  const rows = await Comment.sequelize.query<{ id: number }>(
    `WITH RECURSIVE tree AS (
       SELECT id FROM comments WHERE id = :rootId
       UNION ALL
       SELECT c.id FROM comments c JOIN tree t ON c."parentId" = t.id
     )
     SELECT id FROM tree`,
    { replacements: { rootId }, type: QueryTypes.SELECT }
  )

  return rows.map(r => r.id)
}
