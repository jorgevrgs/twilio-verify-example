import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
