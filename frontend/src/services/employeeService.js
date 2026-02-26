import axios from "axios";

const API_URL = "http://localhost:5000/api/employees";

const getToken = () => localStorage.getItem("token");

export const addEmployee = async (employeeData) => {
  const token = getToken();
  return axios.post(API_URL, employeeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getEmployees = async () => {
  const token = getToken();
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateEmployee = async (id, employeeData) => {
  const token = getToken();
  return axios.put(`${API_URL}/${id}`, employeeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteEmployee = async (id) => {
  const token = getToken();
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};