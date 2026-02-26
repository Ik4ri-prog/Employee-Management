import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

export const register = async (email, password) => {
  const res = await axios.post(`${API_URL}/register`, { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const login = async (formData) => {
  return axios.post(
    "http://localhost:5000/api/auth/login",
    formData
  );
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

export const authAxios = () => {
  const token = getCurrentUser();
  return axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` },
  });
};