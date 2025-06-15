// client/src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // This will be proxied to port 8000 by Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - remove invalid token
      localStorage.removeItem('token');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getUser: () => apiClient.get('/auth/user'),
};

// Page API endpoints
export const pageAPI = {
  getPages: (params) => apiClient.get(`/pages${params ? `?${params}` : ''}`),
  getPage: (slug) => apiClient.get(`/pages/${slug}`),
  createPage: (pageData) => apiClient.post('/pages', pageData),
  updatePage: (slug, pageData) => apiClient.put(`/pages/${slug}`, pageData),
  deletePage: (slug) => apiClient.delete(`/pages/${slug}`),
};

// Version API endpoints
export const versionAPI = {
  getVersionsByPageId: (pageId) => apiClient.get(`/versions/page/${pageId}`),
  getVersion: (versionId) => apiClient.get(`/versions/${versionId}`),
  restoreVersion: (versionId) => apiClient.post(`/versions/${versionId}/restore`),
};

// File API endpoints
export const fileAPI = {
  uploadFile: (formData) => apiClient.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFiles: (params) => apiClient.get(`/files${params ? `?${params}` : ''}`),
  deleteFile: (id) => apiClient.delete(`/files/${id}`),
};

// Search API endpoints
export const searchAPI = {
  search: (query) => apiClient.get(`/search?q=${encodeURIComponent(query)}`),
};

// Default export for backward compatibility
export default apiClient;