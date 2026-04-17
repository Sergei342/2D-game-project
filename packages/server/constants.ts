export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MSG = {
  NOT_AUTHORIZED: 'Not authorized',

  TOPIC_NOT_FOUND: 'Topic not found',
  TOPIC_REQUIRED_FIELDS:
    'title, description, authorId and displayName are required',
  TOPIC_UPDATE_REQUIRED: 'title or description is required',

  COMMENT_NOT_FOUND: 'Comment not found',
  COMMENT_REQUIRED_FIELDS: 'text, authorId and displayName are required',
  COMMENT_TEXT_REQUIRED: 'text is required',
  COMMENT_PARENT_NOT_FOUND: 'Parent comment not found in this topic',
  COMMENT_INVALID_ID: 'Invalid comment ID',

  REACTION_NOT_FOUND: 'Reaction not found',
  REACTION_ALREADY_EXISTS: 'Reaction already exists',
  REACTION_REQUIRED_FIELDS: 'type and userId are required',
  REACTION_INVALID_TYPE: 'Invalid reaction type',
  REACTION_USER_REQUIRED: 'userId is required',
  INTERNAL_ERROR: 'Internal server error',
} as const

export const REACTION_TYPES: string[] = ['👍', '❤️', '😂', '😢', '😡']

export const DEFAULT_PAGE_SIZE = 10000
export const MAX_PAGE_SIZE = 10000
