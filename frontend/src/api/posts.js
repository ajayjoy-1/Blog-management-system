import axiosInstance from './axiosInstance';

export const getPosts = async () => {
  const response = await axiosInstance.get('/posts/');
  return response.data;
};

export const getPost = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}/`);
  return response.data;
};