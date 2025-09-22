import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  
  const { adminLogin, adminCredentials } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(formData.email, formData.password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    if (adminCredentials) {
      setFormData({
        email: adminCredentials.email,
        password: adminCredentials.password
      });
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon">
              <FaUserShield />
            </div>
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-subtitle">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Admin Credentials Box */}
          {adminCredentials && (
            <div className="credentials-box" style={{
              background: '#f8f9fa',
              border: '2px solid #dc3545',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px', color: '#dc3545' }}>Admin Credentials:</h4>
              <div style={{ fontFamily: 'monospace' }}>
                <p style={{ margin: '5px 0' }}><strong>Email:</strong> {adminCredentials.email}</p>
                <p style={{ margin: '5px 0' }}><strong>Password:</strong> {adminCredentials.password}</p>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={fillAdminCredentials}
                style={{ marginTop: '10px' }}
              >
                Fill Admin Credentials
              </button>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FaUserShield className="form-icon" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="form-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input password-input"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Sign In to Admin Portal'
              )}
            </button>
          </form>



          <div className="admin-features">
            <h3 className="admin-features-title">Admin Features:</h3>
            <ul className="admin-features-list">
              <li>✓ Manage Properties</li>
              <li>✓ Edit Hero Slideshow</li>
              <li>✓ View Analytics</li>
              <li>✓ User Management</li>
              <li>✓ Content Management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
