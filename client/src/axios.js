// src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1/auth`,
  withCredentials: true,
});

export default api;
