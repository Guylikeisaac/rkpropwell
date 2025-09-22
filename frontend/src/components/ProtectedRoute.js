import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin) {
    // Redirect to login if user is not authenticated or is not an admin
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
