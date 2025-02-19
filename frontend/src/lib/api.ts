import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";  // Replace with your Django backend URL

export const fetchUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users/`);
    return response.data;
};

export const fetchEmployees = async () => {
    const response = await axios.get(`${API_BASE_URL}/employees/`);
    return response.data;
};
