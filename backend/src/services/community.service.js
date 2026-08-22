const CommunityPost = require('../models/CommunityPost');
const City = require('../models/City');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

class CommunityService {
  /**
   * Create a new community post
   */
  static async createPost(userId, postData) {
    // Validate referenced city if provided
    if (postData.cityId) {
      const city = await City.findById(postData.cityId);
      if (!city) {
        const error = new Error('Referenced City not found');
        error.statusCode = 404;
        throw error;
      }
    }

    // Validate referenced trip if provided
    if (postData.tripId) {
      const trip = await Trip.findById(postData.tripId);
      if (!trip) {
        const error = new Error('Referenced Trip not found');
        error.statusCode = 404;
        throw error;
      }
    }

    // Validate referenced activity if provided
    if (postData.activityId) {
      const activity = await Activity.findById(postData.activityId);
      if (!activity) {
        const error = new Error('Referenced Activity not found');
        error.statusCode = 404;
        throw error;
      }
    }

    const post = new CommunityPost({
      userId,
      title: postData.title,
      content: postData.content,
      images: Array.isArray(postData.images) ? postData.images : [],
      cityId: postData.cityId || null,
      tripId: postData.tripId || null,
      activityId: postData.activityId || null,
      likes: [],
      comments: [],
      commentsCount: 0
    });

    await post.save();

    const populated = await CommunityPost.findById(post._id)
      .populate('userId', 'firstName lastName username profileImage')
      .populate('cityId', 'name country image')
      .populate('tripId', 'name startDate endDate isPublic')
      .populate('activityId', 'name category image')
      .lean();

    return populated;
  }

  /**
   * List community posts with search, filter, sorting, and pagination
   */
  static async getPosts(queryParams = {}, currentUser = null) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const { search, cityId, tripId, userId, sort, sortBy } = queryParams;

    const filter = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { content: regex }
      ];
    }

    if (cityId) {
      filter.cityId = cityId;
    }

    if (tripId) {
      filter.tripId = tripId;
    }

    if (userId) {
      filter.userId = userId;
    }

    let sortOption = { createdAt: -1 };
    const sortKey = sortBy || sort;

    if (sortKey === 'oldest') sortOption = { createdAt: 1 };
    else if (sortKey === 'popular' || sortKey === 'most_liked' || sortKey === 'likes_desc') sortOption = { likesCount: -1, createdAt: -1 };
    else if (sortKey === 'most_commented' || sortKey === 'comments_desc') sortOption = { commentsCount: -1, createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .populate('userId', 'firstName lastName username profileImage city country')
        .populate('cityId', 'name country image')
        .populate('tripId', 'name startDate endDate isPublic')
        .populate('activityId', 'name category image')
        .populate('comments.userId', 'firstName lastName username profileImage')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityPost.countDocuments(filter)
    ]);

    // Attach computed properties (likes count, isLikedByMe)
    const currentUserIdStr = currentUser ? currentUser._id.toString() : null;
    const formattedPosts = posts.map(post => {
      const likesArray = Array.isArray(post.likes) ? post.likes : [];
      const isLikedByMe = currentUserIdStr
        ? likesArray.some(id => id.toString() === currentUserIdStr)
        : false;

      return {
        ...post,
        likesCount: likesArray.length,
        commentsCount: post.commentsCount || (post.comments ? post.comments.length : 0),
        isLikedByMe
      };
    });

    const meta = getPaginationMeta(total, page, limit);
    return { posts: formattedPosts, meta };
  }

  /**
   * Get single post by ID
   */
  static async getPostById(postId, currentUser = null) {
    const post = await CommunityPost.findById(postId)
      .populate('userId', 'firstName lastName username profileImage bio city country')
      .populate('cityId', 'name country region image costIndex')
      .populate('tripId', 'name startDate endDate isPublic description')
      .populate('activityId', 'name category description estimatedCost image rating')
      .populate('comments.userId', 'firstName lastName username profileImage')
      .lean();

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    const currentUserIdStr = currentUser ? currentUser._id.toString() : null;
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const isLikedByMe = currentUserIdStr
      ? likesArray.some(id => id.toString() === currentUserIdStr)
      : false;

    return {
      ...post,
      likesCount: likesArray.length,
      commentsCount: post.commentsCount || (post.comments ? post.comments.length : 0),
      isLikedByMe
    };
  }

  /**
   * Update community post
   */
  static async updatePost(postId, userId, updateData, userRole = 'USER') {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    if (post.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not have permission to edit this post');
      error.statusCode = 403;
      throw error;
    }

    if (updateData.title !== undefined) post.title = updateData.title;
    if (updateData.content !== undefined) post.content = updateData.content;
    if (updateData.images !== undefined) post.images = updateData.images;
    if (updateData.cityId !== undefined) post.cityId = updateData.cityId || null;
    if (updateData.tripId !== undefined) post.tripId = updateData.tripId || null;
    if (updateData.activityId !== undefined) post.activityId = updateData.activityId || null;

    await post.save();

    return this.getPostById(postId, { _id: userId });
  }

  /**
   * Delete community post
   */
  static async deletePost(postId, userId, userRole = 'USER') {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    if (post.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
      const error = new Error('Forbidden: You do not have permission to delete this post');
      error.statusCode = 403;
      throw error;
    }

    await CommunityPost.findByIdAndDelete(postId);

    return { message: 'Community post removed successfully', id: postId };
  }

  /**
   * Like a post (prevent duplicate likes)
   */
  static async likePost(postId, userId) {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    const userIdStr = userId.toString();
    const alreadyLiked = post.likes.some(id => id.toString() === userIdStr);

    if (alreadyLiked) {
      return {
        message: 'Post is already liked',
        liked: true,
        likesCount: post.likes.length
      };
    }

    post.likes.push(userId);
    await post.save();

    return {
      message: 'Post liked successfully',
      liked: true,
      likesCount: post.likes.length
    };
  }

  /**
   * Unlike a post
   */
  static async unlikePost(postId, userId) {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    const userIdStr = userId.toString();
    post.likes = post.likes.filter(id => id.toString() !== userIdStr);
    await post.save();

    return {
      message: 'Post unliked successfully',
      liked: false,
      likesCount: post.likes.length
    };
  }

  /**
   * Add a comment to a post
   */
  static async addComment(postId, userId, commentText) {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    const newComment = {
      userId,
      text: commentText
    };

    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    await post.save();

    const updatedPost = await CommunityPost.findById(postId)
      .populate('comments.userId', 'firstName lastName username profileImage')
      .lean();

    const createdComment = updatedPost.comments[updatedPost.comments.length - 1];

    return {
      message: 'Comment added successfully',
      comment: createdComment,
      commentsCount: post.commentsCount
    };
  }

  /**
   * Get comments for a post
   */
  static async getComments(postId) {
    const post = await CommunityPost.findById(postId)
      .populate('comments.userId', 'firstName lastName username profileImage')
      .lean();

    if (!post) {
      const error = new Error('Community post not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      postId: post._id,
      comments: post.comments || [],
      commentsCount: (post.comments && post.comments.length) || 0
    };
  }

  /**
   * Delete comment (Author or Admin only)
   */
  static async deleteComment(postIdOrCommentId, commentIdMaybe, userId, userRole = 'USER') {
    let post;
    let commentId;

    if (commentIdMaybe) {
      // Called with (postId, commentId)
      post = await CommunityPost.findById(postIdOrCommentId);
      commentId = commentIdMaybe;
    } else {
      // Called with (commentId) alone -> find post containing this comment
      commentId = postIdOrCommentId;
      post = await CommunityPost.findOne({ 'comments._id': commentId });
    }

    if (!post) {
      const error = new Error('Comment or associated post not found');
      error.statusCode = 404;
      throw error;
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      const error = new Error('Comment not found');
      error.statusCode = 404;
      throw error;
    }

    const isCommentAuthor = comment.userId.toString() === userId.toString();
    const isPostOwner = post.userId.toString() === userId.toString();
    const isAdmin = userRole === 'ADMIN';

    if (!isCommentAuthor && !isPostOwner && !isAdmin) {
      const error = new Error('Forbidden: You do not have permission to delete this comment');
      error.statusCode = 403;
      throw error;
    }

    post.comments.pull({ _id: commentId });
    post.commentsCount = post.comments.length;
    await post.save();

    return {
      message: 'Comment deleted successfully',
      commentId,
      commentsCount: post.commentsCount
    };
  }
}

module.exports = CommunityService;
