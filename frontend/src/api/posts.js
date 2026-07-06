import axiosInstance from './axiosInstance';

export const getPosts = async () => {
  const response = await axiosInstance.get('/posts/');
  return response.data;
};

export const getPost = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}/`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axiosInstance.post('/posts/', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await axiosInstance.patch(`/posts/${id}/`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  await axiosInstance.delete(`/posts/${id}/`);
};