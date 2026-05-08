import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8003/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

export const usersAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/users?skip=${skip}&limit=${limit}`),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const categoriesAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/categories?skip=${skip}&limit=${limit}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const menuItemsAPI = {
  getAll: (params?: any) => api.get('/menu-items', { params }),
  create: (data: any) => api.post('/menu-items', data),
  update: (id: number, data: any) => api.put(`/menu-items/${id}`, data),
  delete: (id: number) => api.delete(`/menu-items/${id}`),
};

export const tablesAPI = {
  getAll: (params?: any) => api.get('/tables', { params }),
  create: (data: any) => api.post('/tables', data),
  update: (id: number, data: any) => api.put(`/tables/${id}`, data),
  delete: (id: number) => api.delete(`/tables/${id}`),
};

export const ordersAPI = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status?status=${status}`),
  cancel: (id: number) => api.post(`/orders/${id}/cancel`),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

export const reservationsAPI = {
  getAll: (params?: any) => api.get('/reservations', { params }),
  create: (data: any) => api.post('/reservations', data),
  update: (id: number, data: any) => api.put(`/reservations/${id}`, data),
  cancel: (id: number) => api.post(`/reservations/${id}/cancel`),
  delete: (id: number) => api.delete(`/reservations/${id}`),
};

export const invoicesAPI = {
  getAll: (params?: any) => api.get('/invoices', { params }),
  create: (data: any) => api.post('/invoices', data),
  markPaid: (id: number) => api.post(`/invoices/${id}/pay`),
  cancel: (id: number) => api.post(`/invoices/${id}/cancel`),
  getByOrder: (orderId: number) => api.get(`/invoices/by-order/${orderId}`),
};

export const demoAPI = {
  reset: () => api.post('/demo/reset'),
};

export default api;
