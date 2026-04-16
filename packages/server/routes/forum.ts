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
import { validateReactionParams } from '../middlewares/validateReactionParams'

export const forumRouter = Router()

// Topics
forumRouter.get('/topics', getTopics)
forumRouter.get('/topics/:id', getTopicById)
forumRouter.post('/topics', createTopic)
forumRouter.put('/topics/:id', updateTopic)
forumRouter.delete('/topics/:id', deleteTopic)

// Comments
forumRouter.get('/topics/:topicId/comments', getComments)
forumRouter.post('/topics/:topicId/comments', createComment)
forumRouter.put('/comments/:id', updateComment)
forumRouter.delete('/comments/:id', deleteComment)

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
