import axios from "axios";

const API_URL = "http://localhost:5000/api/dynamic/employees";

const getToken = () => localStorage.getItem("token");
const getEmail = () => localStorage.getItem("email"); 

// CREATE
export const addEmployee = async (employeeData) => {
  const token = getToken();
  return axios.post(
    API_URL,
    {
      ...employeeData,
      createdBy: getEmail(), 
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// READ
export const getEmployees = async () => {
  const token = getToken();
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE
export const updateEmployee = async (id, employeeData) => {
  const token = getToken();
  return axios.put(
    `${API_URL}/${id}`,
    {
      ...employeeData,
      updatedBy: getEmail(),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// DELETE
export const deleteEmployee = async (id) => {
  const token = getToken();
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      deletedBy: getEmail(),
    },
  });
};
