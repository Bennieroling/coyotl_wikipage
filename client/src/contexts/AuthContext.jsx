// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Set token in default headers
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await apiClient.get('/api/auth/user');
          setUser(response.data);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear token if invalid
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await apiClient.get('/api/auth/user');
      setUser(response.data);
      setError(null);
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      logout();
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;