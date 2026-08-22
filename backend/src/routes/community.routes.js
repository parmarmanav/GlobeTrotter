const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  createPostValidation,
  updatePostValidation,
  postQueryValidation,
  addCommentValidation
} = require('../validators/community.validator');

/**
 * @swagger
 * tags:
 *   - name: Community
 *     description: Travel stories, community posts, discussions, likes and comments
 */

/**
 * @swagger
 * /community/posts:
 *   post:
 *     summary: Create a new community post / travel story
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string, example: "My Paris Adventure" }
 *               content: { type: string, example: "Amazing experience roaming through Montmartre..." }
 *               cityId: { type: string }
 *               tripId: { type: string }
 *               activityId: { type: string }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Post published
 */
router.post('/posts', protect, createPostValidation, validate, communityController.createPost);

/**
 * @swagger
 * /community/posts:
 *   get:
 *     summary: Browse, search, filter and sort community posts
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: cityId
 *         schema: { type: string }
 *       - in: query
 *         name: tripId
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [recent, popular, most_commented, oldest] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/posts', optionalAuth, postQueryValidation, validate, communityController.getPosts);

/**
 * @swagger
 * /community/posts/{postId}:
 *   get:
 *     summary: Get single community post with comments
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post details
 */
router.get('/posts/:postId', optionalAuth, communityController.getPostById);

/**
 * @swagger
 * /community/posts/{postId}:
 *   put:
 *     summary: Update an existing community post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put('/posts/:postId', protect, updatePostValidation, validate, communityController.updatePost);

/**
 * @swagger
 * /community/posts/{postId}:
 *   delete:
 *     summary: Delete a community post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete('/posts/:postId', protect, communityController.deletePost);

/**
 * @swagger
 * /community/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post liked
 */
router.post('/posts/:postId/like', protect, communityController.likePost);

/**
 * @swagger
 * /community/posts/{postId}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post unliked
 */
router.delete('/posts/:postId/like', protect, communityController.unlikePost);

/**
 * @swagger
 * /community/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string, example: "This is a great itinerary recommendation!" }
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/posts/:postId/comments', protect, addCommentValidation, validate, communityController.addComment);

/**
 * @swagger
 * /community/posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comments list
 */
router.get('/posts/:postId/comments', communityController.getComments);

/**
 * @swagger
 * /community/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/posts/:postId/comments/:commentId', protect, communityController.deleteComment);

/**
 * @swagger
 * /community/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/comments/:commentId', protect, communityController.deleteComment);

module.exports = router;
