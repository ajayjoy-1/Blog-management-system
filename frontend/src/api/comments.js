import axiosInstance from './axiosInstance';

export const createComment = async (postId, content) => {
  const response = await axiosInstance.post('/comments/', { post: postId, content });
  return response.data;
};

export const updateComment = async (id, content) => {
  const response = await axiosInstance.patch(`/comments/${id}/`, { content });
  return response.data;
};

export const deleteComment = async (id) => {
  await axiosInstance.delete(`/comments/${id}/`);
};