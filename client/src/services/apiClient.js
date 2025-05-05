import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        // Could redirect to login page here if needed
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const registerUser = (userData) => apiClient.post('/auth/register', userData);
const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
const getUserProfile = () => apiClient.get('/auth/user');

// Page endpoints
const getPages = () => apiClient.get('/pages');
const getPage = (slug) => apiClient.get(`/pages/${slug}`);
const createPage = (pageData) => apiClient.post('/pages', pageData);
const updatePage = (slug, pageData) => apiClient.put(`/pages/${slug}`, pageData);
const deletePage = (slug) => apiClient.delete(`/pages/${slug}`);

// File endpoints
const uploadFile = (formData) => {
  return apiClient.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const getFiles = () => apiClient.get('/files');
const getFile = (id) => apiClient.get(`/files/${id}`);
const deleteFile = (id) => apiClient.delete(`/files/${id}`);

// Version endpoints
const createVersion = (versionData) => apiClient.post('/versions', versionData);
const getVersionsByPageId = (pageId) => apiClient.get(`/versions/page/${pageId}`);
const getVersion = (id) => apiClient.get(`/versions/${id}`);
const restoreVersion = (id) => apiClient.post(`/versions/${id}/restore`);

// Search endpoint
const searchWiki = (query) => apiClient.get(`/search?q=${encodeURIComponent(query)}`);

// Export all API functions
const api = {
  // Auth
  registerUser,
  loginUser,
  getUserProfile,
  
  // Pages
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  
  // Files
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  
  // Versions
  createVersion,
  getVersionsByPageId,
  getVersion,
  restoreVersion,
  
  // Search
  searchWiki,
};

export default api;