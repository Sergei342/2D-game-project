import { Router } from 'express'
import type { Request, Response } from 'express'
import { query } from '../db'

const router = Router()

interface CommentRow extends Record<string, unknown> {
  id: number
  topic_id: number
  author: string
  text: string
  user_id: number | null
  created_at: Date
}

interface ReactionRow extends Record<string, unknown> {
  id: number
  comment_id: number
  user_id: number
  emoji: string
  created_at: Date
}

/**
 * POST /forum/topics/:topicId/comments
 *
 * Минимальный эндпоинт для создания комментария — нужен, чтобы
 * получить comment_id для последующей работы с реакциями.
 *
 * Body: { author: string, text: string, userId?: number }
 */
router.post(
  '/topics/:topicId/comments',
  async (req: Request, res: Response): Promise<void> => {
    const topicId = Number(req.params['topicId'])
    if (isNaN(topicId)) {
      res.status(400).json({ reason: 'Invalid topicId' })
      return
    }

    const { author, text, userId } = req.body as {
      author?: string
      text?: string
      userId?: number
    }

    if (!author || !text) {
      res.status(400).json({ reason: 'author and text are required' })
      return
    }

    try {
      const result = await query<CommentRow>(
        `INSERT INTO forum_comments (topic_id, author, text, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [topicId, author, text, userId ?? null]
      )
      res.status(201).json(result.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ reason: 'Internal server error' })
    }
  }
)

/**
 * GET /forum/topics/:topicId/comments/:commentId/reactions
 *
 * Возвращает список реакций для комментария.
 * Проверяет через JOIN, что комментарий принадлежит указанному топику.
 */
router.get(
  '/topics/:topicId/comments/:commentId/reactions',
  async (req: Request, res: Response): Promise<void> => {
    const topicId = Number(req.params['topicId'])
    const commentId = Number(req.params['commentId'])
    if (isNaN(topicId) || isNaN(commentId)) {
      res.status(400).json({ reason: 'Invalid topicId or commentId' })
      return
    }

    try {
      const result = await query<ReactionRow>(
        `SELECT r.id, r.comment_id, r.user_id, r.emoji, r.created_at
         FROM forum_reactions r
         JOIN forum_comments c ON c.id = r.comment_id
         WHERE r.comment_id = $1 AND c.topic_id = $2
         ORDER BY r.created_at ASC`,
        [commentId, topicId]
      )
      res.json(result.rows)
    } catch (e) {
      console.error(e)
      res.status(500).json({ reason: 'Internal server error' })
    }
  }
)

/**
 * POST /forum/topics/:topicId/comments/:commentId/reactions
 *
 * Добавляет реакцию к комментарию.
 * Проверяет, что комментарий принадлежит топику.
 * Дубль (comment_id + user_id + emoji) игнорируется — возвращает существующую реакцию.
 *
 * Body: { emoji: string, userId: number }
 *
 * TODO: когда появится auth-middleware, userId брать из сессии, не из тела запроса.
 */
router.post(
  '/topics/:topicId/comments/:commentId/reactions',
  async (req: Request, res: Response): Promise<void> => {
    const topicId = Number(req.params['topicId'])
    const commentId = Number(req.params['commentId'])
    if (isNaN(topicId) || isNaN(commentId)) {
      res.status(400).json({ reason: 'Invalid topicId or commentId' })
      return
    }

    const { emoji, userId } = req.body as {
      emoji?: string
      userId?: number
    }

    if (!emoji) {
      res.status(400).json({ reason: 'emoji is required' })
      return
    }
    if (
      typeof userId !== 'number' ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      res.status(400).json({ reason: 'userId must be a positive integer' })
      return
    }

    try {
      const commentCheck = await query(
        `SELECT id FROM forum_comments WHERE id = $1 AND topic_id = $2`,
        [commentId, topicId]
      )
      if (!commentCheck.rowCount) {
        res.status(404).json({ reason: 'Comment not found in this topic' })
        return
      }

      const insert = await query<ReactionRow>(
        `INSERT INTO forum_reactions (comment_id, user_id, emoji)
         VALUES ($1, $2, $3)
         ON CONFLICT ON CONSTRAINT forum_reactions_unique DO NOTHING
         RETURNING *`,
        [commentId, userId, emoji]
      )

      if (insert.rows.length > 0) {
        res.status(201).json(insert.rows[0])
        return
      }

      // Дубль — возвращаем существующую реакцию
      const existing = await query<ReactionRow>(
        `SELECT id, comment_id, user_id, emoji, created_at
         FROM forum_reactions
         WHERE comment_id = $1 AND user_id = $2 AND emoji = $3`,
        [commentId, userId, emoji]
      )
      res.status(200).json(existing.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ reason: 'Internal server error' })
    }
  }
)

/**
 * DELETE /forum/topics/:topicId/comments/:commentId/reactions/:reactionId?userId=X
 *
 * Удаляет реакцию текущего пользователя.
 * userId обязателен — без него возвращает 400.
 * Проверяет через JOIN, что комментарий принадлежит указанному топику.
 *
 * TODO: когда появится auth-middleware, userId брать из сессии.
 */
router.delete(
  '/topics/:topicId/comments/:commentId/reactions/:reactionId',
  async (req: Request, res: Response): Promise<void> => {
    const topicId = Number(req.params['topicId'])
    const commentId = Number(req.params['commentId'])
    const reactionId = Number(req.params['reactionId'])
    if (isNaN(topicId) || isNaN(commentId) || isNaN(reactionId)) {
      res
        .status(400)
        .json({ reason: 'Invalid topicId, commentId or reactionId' })
      return
    }

    const rawUserId = req.query['userId']
    const userId = typeof rawUserId === 'string' ? Number(rawUserId) : NaN
    if (!Number.isInteger(userId) || userId <= 0) {
      res
        .status(400)
        .json({ reason: 'userId query param must be a positive integer' })
      return
    }

    try {
      const result = await query(
        `DELETE FROM forum_reactions
         USING forum_comments
         WHERE forum_reactions.id = $1
           AND forum_reactions.comment_id = $2
           AND forum_reactions.user_id = $3
           AND forum_comments.id = forum_reactions.comment_id
           AND forum_comments.topic_id = $4
         RETURNING forum_reactions.id`,
        [reactionId, commentId, userId, topicId]
      )

      if (!result.rowCount) {
        res.status(404).json({ reason: 'Reaction not found' })
        return
      }

      res.json({ id: reactionId })
    } catch (e) {
      console.error(e)
      res.status(500).json({ reason: 'Internal server error' })
    }
  }
)

export default router
