import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export const communityService = {
  getPosts: (params) => apiClient.get(ENDPOINTS.COMMUNITY.POSTS, { params }),
  getPostById: (postId) => apiClient.get(ENDPOINTS.COMMUNITY.POST_BY_ID(postId)),
  createPost: (postData) => apiClient.post(ENDPOINTS.COMMUNITY.POSTS, postData),
  updatePost: (postId, postData) => apiClient.put(ENDPOINTS.COMMUNITY.POST_BY_ID(postId), postData),
  deletePost: (postId) => apiClient.delete(ENDPOINTS.COMMUNITY.POST_BY_ID(postId)),
  likePost: (postId) => apiClient.post(ENDPOINTS.COMMUNITY.LIKE(postId)),
  unlikePost: (postId) => apiClient.delete(ENDPOINTS.COMMUNITY.LIKE(postId)),

  // Comments
  getComments: (postId) => apiClient.get(ENDPOINTS.COMMUNITY.COMMENTS(postId)),
  addComment: (postId, commentData) => apiClient.post(ENDPOINTS.COMMUNITY.COMMENTS(postId), commentData),
  deleteComment: (commentId) => apiClient.delete(ENDPOINTS.COMMUNITY.COMMENT_BY_ID(commentId)),
}
