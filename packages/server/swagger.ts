import swaggerJsdoc from 'swagger-jsdoc'
import {
  REACTION_TYPES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  COMMENT_TEXT_MIN_LENGTH,
  COMMENT_TEXT_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
} from './constants'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Space Invaders Forum API',
      version: '1.0.0',
      description: 'API для форума проекта Space Invaders',
    },
    servers: [
      {
        url: '/api/v1/forum',
        description: 'Forum API v1',
      },
    ],
    components: {
      schemas: {
        Author: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            displayName: { type: 'string' },
            avatar: { type: 'string', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        OkResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
          },
        },

        TopicItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            authorId: { type: 'integer' },
            author: { $ref: '#/components/schemas/Author' },
            commentsCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TopicsPaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TopicItem' },
            },
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        CreateTopicRequest: {
          type: 'object',
          required: ['title', 'description', 'authorId', 'displayName'],
          properties: {
            title: {
              type: 'string',
              minLength: TITLE_MIN_LENGTH,
              maxLength: TITLE_MAX_LENGTH,
              example: 'Стратегии прохождения',
            },
            description: {
              type: 'string',
              minLength: DESCRIPTION_MIN_LENGTH,
              maxLength: DESCRIPTION_MAX_LENGTH,
              example: 'Обсуждаем лучшие стратегии',
            },
            authorId: { type: 'integer', minimum: 1, example: 42 },
            displayName: {
              type: 'string',
              minLength: DISPLAY_NAME_MIN_LENGTH,
              maxLength: DISPLAY_NAME_MAX_LENGTH,
              example: 'PlayerOne',
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: '/avatars/42.jpg',
            },
          },
        },
        UpdateTopicRequest: {
          type: 'object',
          description: 'Нужно передать хотя бы одно из полей',
          properties: {
            title: {
              type: 'string',
              minLength: TITLE_MIN_LENGTH,
              maxLength: TITLE_MAX_LENGTH,
              example: 'Новое название',
            },
            description: {
              type: 'string',
              minLength: DESCRIPTION_MIN_LENGTH,
              maxLength: DESCRIPTION_MAX_LENGTH,
              example: 'Новое описание',
            },
          },
        },

        ReactionItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string' },
            userId: { type: 'integer' },
            commentId: { type: 'integer' },
          },
        },
        CommentItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            text: { type: 'string' },
            authorId: { type: 'integer' },
            author: { $ref: '#/components/schemas/Author' },
            topicId: { type: 'integer' },
            parentId: { type: 'integer', nullable: true },
            reactions: {
              type: 'array',
              items: { $ref: '#/components/schemas/ReactionItem' },
            },
            replies: {
              type: 'array',
              items: { $ref: '#/components/schemas/CommentItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCommentRequest: {
          type: 'object',
          required: ['text', 'authorId', 'displayName'],
          properties: {
            text: {
              type: 'string',
              minLength: COMMENT_TEXT_MIN_LENGTH,
              maxLength: COMMENT_TEXT_MAX_LENGTH,
              example: 'Отличная тема!',
            },
            authorId: { type: 'integer', minimum: 1, example: 42 },
            displayName: {
              type: 'string',
              minLength: DISPLAY_NAME_MIN_LENGTH,
              maxLength: DISPLAY_NAME_MAX_LENGTH,
              example: 'PlayerOne',
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: '/avatars/42.jpg',
            },
            parentId: {
              type: 'integer',
              nullable: true,
              minimum: 1,
              description: 'ID родительского комментария (для reply)',
              example: null,
            },
          },
        },
        UpdateCommentRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: COMMENT_TEXT_MIN_LENGTH,
              maxLength: COMMENT_TEXT_MAX_LENGTH,
              example: 'Отредактированный текст',
            },
          },
        },

        CreateReactionRequest: {
          type: 'object',
          required: ['type', 'userId'],
          properties: {
            type: { type: 'string', enum: REACTION_TYPES, example: '👍' },
            userId: { type: 'integer', minimum: 1, example: 42 },
          },
        },
        UpdateReactionRequest: {
          type: 'object',
          required: ['type', 'userId'],
          properties: {
            type: { type: 'string', enum: REACTION_TYPES, example: '❤️' },
            userId: { type: 'integer', minimum: 1, example: 42 },
          },
        },
        DeleteReactionRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'integer', minimum: 1, example: 42 },
          },
        },
      },
    },

    paths: {
      '/topics': {
        get: {
          tags: ['topics'],
          summary: 'Список топиков (с пагинацией)',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', minimum: 1, default: 1 },
            },
            {
              name: 'pageSize',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: MAX_PAGE_SIZE,
                default: DEFAULT_PAGE_SIZE,
              },
            },
          ],
          responses: {
            200: {
              description: 'Список топиков',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TopicsPaginatedResponse',
                  },
                },
              },
            },
            400: {
              description: 'Невалидные page или pageSize',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['topics'],
          summary: 'Создать топик',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTopicRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Топик создан',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TopicItem' },
                },
              },
            },
            400: {
              description:
                'Не хватает обязательных полей или нарушены ограничения длины',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/topics/{id}': {
        get: {
          tags: ['topics'],
          summary: 'Получить топик по ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Топик',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TopicItem' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Топик не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        put: {
          tags: ['topics'],
          summary: 'Обновить топик',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateTopicRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Обновлённый топик',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TopicItem' },
                },
              },
            },
            400: {
              description:
                'Невалидный id, не указаны title/description или нарушены ограничения длины',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Топик не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['topics'],
          summary: 'Удалить топик (каскадно с комментариями и реакциями)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Удалено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Топик не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/topics/{topicId}/comments': {
        get: {
          tags: ['comments'],
          summary: 'Все комментарии к топику (дерево)',
          parameters: [
            {
              name: 'topicId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Дерево комментариев',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CommentItem' },
                  },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Топик не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['comments'],
          summary: 'Создать комментарий (или reply)',
          parameters: [
            {
              name: 'topicId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCommentRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Комментарий создан',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CommentItem' },
                },
              },
            },
            400: {
              description:
                'Не хватает обязательных полей или нарушены ограничения длины',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Топик или родительский комментарий не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/comments/{id}': {
        put: {
          tags: ['comments'],
          summary: 'Обновить комментарий',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCommentRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Обновлённый комментарий',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CommentItem' },
                },
              },
            },
            400: {
              description: 'Не указан text или нарушены ограничения длины',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Комментарий не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['comments'],
          summary: 'Удалить комментарий (каскадно с дочерними)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Удалено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Комментарий не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/comments/{commentId}/reactions': {
        get: {
          tags: ['reactions'],
          summary: 'Получить реакции комментария',
          parameters: [
            {
              name: 'commentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Список реакций',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ReactionItem' },
                  },
                },
              },
            },
            400: {
              description: 'Невалидный commentId',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Комментарий не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['reactions'],
          summary: 'Добавить реакцию',
          parameters: [
            {
              name: 'commentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateReactionRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Реакция создана',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ReactionItem' },
                },
              },
            },
            400: {
              description:
                'Невалидный commentId / тип реакции / userId, или реакция уже существует',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Комментарий не найден',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        put: {
          tags: ['reactions'],
          summary: 'Обновить реакцию',
          parameters: [
            {
              name: 'commentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateReactionRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Обновлённая реакция',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ReactionItem' },
                },
              },
            },
            400: {
              description: 'Невалидный commentId / тип реакции / userId',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Реакция не найдена',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['reactions'],
          summary: 'Удалить реакцию',
          parameters: [
            {
              name: 'commentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeleteReactionRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Удалено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            400: {
              description: 'Невалидный commentId или userId',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            403: {
              description: 'Не авторизован',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Реакция не найдена',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)
