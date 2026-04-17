import type { Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
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
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
} from '../constants'
import { isValidText } from '../middlewares/forumValidators'

/**
 * GET запрос на получение топиков с пагинацией /api/v1/forum/topics?page=1&pageSize=10000
 *
 */
export const getTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1
    const pageSize = Math.min(
      req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE,
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

    const topicIds = topics.map(topic => topic.id)
    const countByTopicId = new Map<number, number>()

    if (topicIds.length > 0) {
      if (!Comment.sequelize) {
        throw new Error('Sequelize instance is not available')
      }

      const counts = await Comment.sequelize.query<{
        topicId: number
        count: string
      }>(
        `SELECT "topicId", COUNT("id") AS "count"
         FROM "comments"
         WHERE "topicId" IN (:topicIds)
         GROUP BY "topicId"`,
        {
          replacements: { topicIds },
          type: QueryTypes.SELECT,
        }
      )

      counts.forEach(({ topicId, count }) => {
        countByTopicId.set(topicId, Number(count))
      })
    }

    const result = topics.map(topic => ({
      ...topic.toJSON(),
      commentsCount: countByTopicId.get(topic.id) ?? 0,
    }))

    res.json({
      data: result,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
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
    const id = Number(req.params.id)
    const topic = await Topic.findByPk(id, {
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
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
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
    // TODO: после реализации authMiddleware брать authorId из req.user.id, не из body
    const { title, description, authorId, displayName, avatar } = req.body

    if (!authorId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.TOPIC_REQUIRED_FIELDS })
      return
    }

    if (!isValidText(title, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_TITLE })
      return
    }

    if (
      !isValidText(description, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH)
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_DESCRIPTION })
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

    // обновляем внутреннюю доп таблицу с данными пользователей, да, к сожалению, синхронизации с яндекс апи нет,
    // обновляется только при запросах создания топиков и сообщений, но зато хоть так будет актуальный аватар и ник
    await updateUserProfile(authorId, sanitize(displayName), avatar)

    const created = await Topic.create({
      title: sanitize(title),
      description: sanitize(description),
      authorId,
    })

    const topic = await Topic.findByPk(created.id, {
      include: [
        {
          model: UserProfile,
          as: 'author',
          attributes: ['id', 'displayName', 'avatar'],
        },
      ],
    })

    res
      .status(HTTP_STATUS.CREATED)
      .json({ ...topic?.toJSON(), commentsCount: 0 })
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
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
    const id = Number(req.params.id)
    const topic = await Topic.findByPk(id)

    if (!topic) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MSG.TOPIC_NOT_FOUND })
      return
    }

    const { title, description } = req.body

    if (title === undefined && description === undefined) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.TOPIC_UPDATE_REQUIRED })
      return
    }

    if (
      title !== undefined &&
      !isValidText(title, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_TITLE })
      return
    }

    if (
      description !== undefined &&
      !isValidText(description, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH)
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MSG.INVALID_DESCRIPTION })
      return
    }

    if (title !== undefined) {
      topic.title = sanitize(title)
    }

    if (description !== undefined) {
      topic.description = sanitize(description)
    }

    await topic.save()

    res.json(topic)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
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
    const id = Number(req.params.id)
    const topic = await Topic.findByPk(id)

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

    if (!Comment.sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    await Comment.sequelize.transaction(async transaction => {
      if (commentIds.length > 0) {
        await Reaction.destroy({
          where: { commentId: commentIds },
          transaction,
        })
      }
      await Comment.destroy({ where: { topicId: topic.id }, transaction })
      await topic.destroy({ transaction })
    })

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MSG.INTERNAL_ERROR })
  }
}
