// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiClient';

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
          // Get current user data - the authAPI already handles the token
          const response = await authAPI.getUser();
          setUser(response.data);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear token if invalid
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      
      const response = await authAPI.getUser();
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
EOF