import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAdmin(storedIsAdmin === 'true');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAdmin', userData.role === 'admin');
        localStorage.setItem('token', token);
        
        setLoading(false);
        return { success: true, user: userData };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const adminLogin = async (email, password) => {
    setLoading(true);
    
    try {
      const response = await authAPI.adminLogin({ email, password });
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        
        setUser(userData);
        setIsAdmin(true);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('token', token);
        
        setLoading(false);
        return { success: true, user: userData };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { user: newUser, token } = response.data.data;
        
        setUser(newUser);
        setIsAdmin(false);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('token', token);
        
        setLoading(false);
        return { success: true, user: newUser };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
  };

  // Test user credentials for demo purposes
  const testUserCredentials = {
    email: 'user@test.com',
    password: 'user123'
  };

  // Admin credentials for demo purposes
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    adminLogin,
    register,
    logout,
    testUserCredentials,
    adminCredentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
