import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: true,
});
