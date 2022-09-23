import axios from 'axios';

export const httpClient = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});
