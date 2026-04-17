import type { Request, Response } from 'express'
import { Topic } from '../models/Topic'
import { Comment } from '../models/Comment'
import { Reaction } from '../models/Reaction'
import { UserProfile } from '../models/UserProfile'
import { sanitize } from '../utils/sanitize'
import { updateUserProfile } from '../utils/userProfileUtils'
import {
  HTTP_STATUS,
  ERROR_MSG,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../constants'

/**
 * GET запрос на получение топиков с пагинацией /api/v1/forum/topics?page=1&pageSize=10000
 *
 */
export const getTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    )

    const { rows: topics, count: total } = await Topic.findAndCountAll({
      include: [
        {
          model: UserProfile,
          as: 'author',
          attributes: ['id', 'displayName', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    const result = await Promise.all(
      topics.map(async topic => {
        const commentsCount = await Comment.count({
          where: { topicId: topic.id },
        })
        return { ...topic.toJSON(), commentsCount }
      })
    )

    res.json({
      data: result,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * GET запрос на получение топика по ИД /api/v1/forum/topics/:id
 *
 */
export const getTopicById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: [
        {
          model: UserProfile,
          as: 'author',
          attributes: ['id', 'displayName', 'avatar'],
        },
      ],
    })

    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    const commentsCount = await Comment.count({ where: { topicId: topic.id } })
    res.json({ ...topic.toJSON(), commentsCount })
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * POST запрос на создание топика /api/v1/forum/topics
 *
 */
export const createTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, authorId, displayName, avatar } = req.body

    if (!title || !description || !authorId || !displayName) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.TOPIC_REQUIRED_FIELDS })
      return
    }

    // обновляем внутреннюю доп таблицу с данными пользователей, да, к сожалению, синхронизации с яндекс апи нет,
    // обновляется только при запросах создания топиков и сообщений, но зато хоть так будет актуальный аватар и ник
    await updateUserProfile(authorId, sanitize(displayName), avatar)

    const topic = await Topic.create({
      title: sanitize(title),
      description: sanitize(description),
      authorId,
    })
    res.status(HTTP_STATUS.CREATED).json(topic)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * PUT запрос на обновление топика /api/v1/forum/topics/:id
 *
 */
export const updateTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topic = await Topic.findByPk(req.params.id)

    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    const { title, description } = req.body

    if (!title && !description) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.TOPIC_UPDATE_REQUIRED })
      return
    }

    if (title) {
      topic.title = sanitize(title)
    }

    if (description) {
      topic.description = sanitize(description)
    }

    await topic.save()

    res.json(topic)
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}

/**
 * DELETE запрос на удаление топика /api/v1/forum/topics/:id
 *
 */
export const deleteTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topic = await Topic.findByPk(req.params.id)

    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    //удалить коменты к топику и эмодзи
    const comments = await Comment.findAll({
      where: { topicId: topic.id },
      attributes: ['id'],
    })
    const commentIds = comments.map(c => c.id)

    if (commentIds.length > 0) {
      await Reaction.destroy({ where: { commentId: commentIds } })
    }

    await Comment.destroy({ where: { topicId: topic.id } })
    await topic.destroy()

    res.json({ ok: true })
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: String(err) })
  }
}
