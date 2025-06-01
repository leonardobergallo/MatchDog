import axios from 'axios';

const API_URL = 'https://3aa6-190-17-52-136.ngrok-free.app/api'; // Cambia esto si usas otro host o puerto

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const registro = async (nombre, email, contraseña) => {
  const res = await api.post('/auth/registro', { nombre, email, contraseña });
  return res.data;
};

export const login = async (email, contraseña) => {
  const res = await api.post('/auth/inicio-sesion', { email, contraseña });
  return res.data;
};

export default api; 