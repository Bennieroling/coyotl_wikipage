// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/user')
};

// Page services
export const pageService = {
  getAllPages: (params) => api.get('/pages', { params }),
  getPage: (slug) => api.get(`/pages/${slug}`),
  createPage: (pageData) => api.post('/pages', pageData),
  updatePage: (slug, pageData) => api.put(`/pages/${slug}`, pageData),
  deletePage: (slug) => api.delete(`/pages/${slug}`),
  searchPages: (query) => api.get('/pages/search', { params: { q: query } })
};

export default {
  auth: authService,
  pages: pageService
};