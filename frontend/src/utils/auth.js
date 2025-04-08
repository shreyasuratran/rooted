// utils/auth.js
import api from './axios';

export const isTokenValid = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  try {
    const res = await api.get('/auth/verify');
    return res.status === 200;
  } catch (err) {
    localStorage.removeItem('access_token');
    return false;
  }
};
