export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const REACTION_TYPES: string[] = ['👍', '❤️', '😂', '😢', '😡']

export const DEFAULT_PAGE_SIZE = 10000
export const MAX_PAGE_SIZE = 10000

export const TITLE_MIN_LENGTH = 1
export const TITLE_MAX_LENGTH = 255
export const DESCRIPTION_MIN_LENGTH = 1
export const DESCRIPTION_MAX_LENGTH = 5000
export const COMMENT_TEXT_MIN_LENGTH = 1
export const COMMENT_TEXT_MAX_LENGTH = 5000
export const DISPLAY_NAME_MIN_LENGTH = 1
export const DISPLAY_NAME_MAX_LENGTH = 100

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

  INVALID_PAGE: 'page must be a positive integer',
  INVALID_PAGE_SIZE: 'pageSize must be a positive integer',

  INVALID_TITLE: `title must be ${TITLE_MIN_LENGTH}..${TITLE_MAX_LENGTH} characters`,
  INVALID_DESCRIPTION: `description must be ${DESCRIPTION_MIN_LENGTH}..${DESCRIPTION_MAX_LENGTH} characters`,
  INVALID_COMMENT_TEXT: `text must be ${COMMENT_TEXT_MIN_LENGTH}..${COMMENT_TEXT_MAX_LENGTH} characters`,
  INVALID_DISPLAY_NAME: `displayName must be ${DISPLAY_NAME_MIN_LENGTH}..${DISPLAY_NAME_MAX_LENGTH} characters`,
} as const
