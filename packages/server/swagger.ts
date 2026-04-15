import swaggerJsdoc from 'swagger-jsdoc'

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
            title: { type: 'string', example: 'Стратегии прохождения' },
            description: {
              type: 'string',
              example: 'Обсуждаем лучшие стратегии',
            },
            authorId: { type: 'integer', example: 42 },
            displayName: { type: 'string', example: 'PlayerOne' },
            avatar: {
              type: 'string',
              nullable: true,
              example: '/avatars/42.jpg',
            },
          },
        },
        UpdateTopicRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Новое название' },
            description: { type: 'string', example: 'Новое описание' },
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
            text: { type: 'string', example: 'Отличная тема!' },
            authorId: { type: 'integer', example: 42 },
            displayName: { type: 'string', example: 'PlayerOne' },
            avatar: {
              type: 'string',
              nullable: true,
              example: '/avatars/42.jpg',
            },
            parentId: {
              type: 'integer',
              nullable: true,
              description: 'ID родительского комментария (для reply)',
              example: null,
            },
          },
        },
        UpdateCommentRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string', example: 'Отредактированный текст' },
          },
        },

        CreateReactionRequest: {
          type: 'object',
          required: ['type', 'userId'],
          properties: {
            type: { type: 'string', example: 'like' },
            userId: { type: 'integer', example: 42 },
          },
        },
        UpdateReactionRequest: {
          type: 'object',
          required: ['type', 'userId'],
          properties: {
            type: { type: 'string', example: 'dislike' },
            userId: { type: 'integer', example: 42 },
          },
        },
        DeleteReactionRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'integer', example: 42 },
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
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'pageSize',
              in: 'query',
              schema: { type: 'integer', default: 10000 },
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
              description: 'Не хватает обязательных полей',
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
              description: 'Не указаны title или description',
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
              description: 'Не хватает обязательных полей',
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
              description: 'Не указан text',
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
              description: 'Не хватает полей / реакция уже существует',
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
              description: 'Не хватает полей',
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
              description: 'Не указан userId',
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
