import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}`; // Replace with your Django backend URL

export const fetchUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users/`);
    return response.data;
};

export const fetchEmployees = async () => {
    const response = await axios.get(`${API_BASE_URL}/employees/`);
    return response.data;
};
