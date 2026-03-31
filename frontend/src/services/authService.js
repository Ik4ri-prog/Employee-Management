import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/dynamic";

// REGISTER
export const register = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, {
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

// LOGIN
export const login = async (formData) => {
  return axios.post(`${API_BASE_URL}/auth/login`, formData);
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
};

// GET TOKEN
export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

// AUTH AXIOS INSTANCE
export const authAxios = () => {
  const token = getCurrentUser();

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
