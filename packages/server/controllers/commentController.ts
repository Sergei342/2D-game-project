import type { Request, Response } from 'express'
import { Comment } from '../models/Comment'
import { Topic } from '../models/Topic'
import { UserProfile } from '../models/UserProfile'
import { Reaction } from '../models/Reaction'
import { sanitize } from '../utils/sanitize'
import { updateUserProfile } from '../utils/userProfileUtils'
import { HTTP_STATUS, ERROR_MSG } from '../constants'

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
    const { topicId } = req.params

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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
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
    const { topicId } = req.params
    const { text, authorId, displayName, avatar, parentId } = req.body

    if (!text || !authorId || !displayName) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.COMMENT_REQUIRED_FIELDS })
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
      if (!parent || parent.topicId !== Number(topicId)) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ error: ERROR_MSG.COMMENT_PARENT_NOT_FOUND })
        return
      }
    }

    await updateUserProfile(authorId, sanitize(displayName), avatar)

    const comment = await Comment.create({
      text: sanitize(text),
      authorId,
      topicId,
      parentId: parentId ?? null,
    })

    res.status(HTTP_STATUS.CREATED).json(comment)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
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
    const comment = await Comment.findByPk(req.params.id)

    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const { text } = req.body

    if (!text) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.COMMENT_TEXT_REQUIRED })
      return
    }

    comment.text = sanitize(text)
    await comment.save()

    res.json(comment)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
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
    const comment = await Comment.findByPk(req.params.id)

    if (!comment) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.COMMENT_NOT_FOUND })
      return
    }

    const allIds = await collectDescendantIds(comment.id)

    await Reaction.destroy({ where: { commentId: allIds } })
    await Comment.destroy({ where: { id: allIds } })

    res.json({ ok: true })
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

interface CommentNode {
  id: number
  parentId: number | null
  replies: CommentNode[]
  [key: string]: unknown
}

function formatComment(c: Comment): CommentNode {
  const json = c.toJSON() as CommentNode

  delete json.topic
  delete json.parent

  json.replies = []

  return json
}

function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodeMap = new Map<number, CommentNode>()

  comments.forEach(comment => {
    nodeMap.set(comment.id, formatComment(comment))
  })

  const roots: CommentNode[] = []

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
  const queue = [rootId]

  for (let i = 0; i < queue.length; i++) {
    const children = await Comment.findAll({
      where: { parentId: queue[i] },
      attributes: ['id'],
    })

    queue.push(...children.map(child => child.id))
  }

  return queue
}
