import axiosInstance from './axiosInstance';

export const loginUser = async (username, password) => {
  const response = await axiosInstance.post('/token/', { username, password });
  return response.data;
};