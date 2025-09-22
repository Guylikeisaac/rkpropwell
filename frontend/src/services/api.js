import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Property API calls
export const propertyAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  getFeaturedProperties: () => api.get('/properties/featured'),
  createProperty: (formData) => api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProperty: (id, formData) => api.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getUserProperties: () => api.get('/properties/user/my-properties'),
  getAllPropertiesAdmin: (params) => api.get('/properties/admin/all', { params }),
  updatePropertyStatus: (id, statusData) => api.put(`/properties/${id}/status`, statusData),
  deletePropertyImage: (propertyId, imageId) => api.delete(`/properties/${propertyId}/images/${imageId}`),
};

// User API calls
export const userAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserStatus: (id, statusData) => api.put(`/users/${id}/status`, statusData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
  getAdminStats: () => api.get('/users/admin/stats'),
};

// Hero API calls
export const heroAPI = {
  getHeroSlides: () => api.get('/hero/slides'),
  getHeroStats: () => api.get('/hero/stats'),
  updatePropertyFeatured: (propertyId, isFeatured) => api.put(`/hero/property/${propertyId}/featured`, { isFeatured }),
};

export default api;
