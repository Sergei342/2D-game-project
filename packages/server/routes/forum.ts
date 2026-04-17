import { Router } from 'express'
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../controllers/topicController'
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController'
import {
  createReaction,
  updateReaction,
  deleteReaction,
} from '../controllers/reactionController'
import {
  validateReactionParams,
  validatePagination,
  validateIdParam,
} from '../middlewares/forumValidators'

export const forumRouter = Router()

// Topics
forumRouter.get('/topics', validatePagination, getTopics)
forumRouter.get('/topics/:id', validateIdParam('id'), getTopicById)
forumRouter.post('/topics', createTopic)
forumRouter.put('/topics/:id', validateIdParam('id'), updateTopic)
forumRouter.delete('/topics/:id', validateIdParam('id'), deleteTopic)

// Comments
forumRouter.get(
  '/topics/:topicId/comments',
  validateIdParam('topicId'),
  getComments
)
forumRouter.post(
  '/topics/:topicId/comments',
  validateIdParam('topicId'),
  createComment
)
forumRouter.put('/comments/:id', validateIdParam('id'), updateComment)
forumRouter.delete('/comments/:id', validateIdParam('id'), deleteComment)

// Reactions
forumRouter.post(
  '/comments/:commentId/reactions',
  validateReactionParams,
  createReaction
)
forumRouter.put(
  '/comments/:commentId/reactions',
  validateReactionParams,
  updateReaction
)
forumRouter.delete(
  '/comments/:commentId/reactions',
  validateReactionParams,
  deleteReaction
)
