const CommunityService = require('../services/community.service');
const ApiResponse = require('../utils/apiResponse');

class CommunityController {
  /**
   * Create a new post
   */
  static async createPost(req, res, next) {
    try {
      const post = await CommunityService.createPost(req.user._id, req.body);
      return ApiResponse.success(res, 'Post published to community successfully', post, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List community posts
   */
  static async getPosts(req, res, next) {
    try {
      const { posts, meta } = await CommunityService.getPosts(req.query, req.user);
      return ApiResponse.success(res, 'Community posts retrieved successfully', posts, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single post by ID
   */
  static async getPostById(req, res, next) {
    try {
      const post = await CommunityService.getPostById(req.params.postId, req.user);
      return ApiResponse.success(res, 'Community post retrieved successfully', post, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update post
   */
  static async updatePost(req, res, next) {
    try {
      const updated = await CommunityService.updatePost(
        req.params.postId,
        req.user._id,
        req.body,
        req.user.role
      );
      return ApiResponse.success(res, 'Community post updated successfully', updated, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete post
   */
  static async deletePost(req, res, next) {
    try {
      const result = await CommunityService.deletePost(
        req.params.postId,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like a post
   */
  static async likePost(req, res, next) {
    try {
      const result = await CommunityService.likePost(req.params.postId, req.user._id);
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unlike a post
   */
  static async unlikePost(req, res, next) {
    try {
      const result = await CommunityService.unlikePost(req.params.postId, req.user._id);
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment to post
   */
  static async addComment(req, res, next) {
    try {
      const result = await CommunityService.addComment(
        req.params.postId,
        req.user._id,
        req.body.text
      );
      return ApiResponse.success(res, result.message, result.comment, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comments for post
   */
  static async getComments(req, res, next) {
    try {
      const result = await CommunityService.getComments(req.params.postId);
      return ApiResponse.success(res, 'Post comments retrieved successfully', result.comments, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment
   */
  static async deleteComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const postId = req.params.postId || null;

      const result = await CommunityService.deleteComment(
        postId || commentId,
        postId ? commentId : null,
        req.user._id,
        req.user.role
      );
      return ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommunityController;
