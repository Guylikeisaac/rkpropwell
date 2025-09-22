import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaSearch, FaPlus, FaChartBar } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-text">RK PropWell</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              Home
            </Link>
            
            {/* Navigation for regular users */}
            {!isAdmin && (
              <>
                <Link 
                  to="/buy" 
                  className={`nav-link ${isActive('/buy') ? 'active' : ''}`}
                >
                  Buy
                </Link>
                <Link 
                  to="/rent" 
                  className={`nav-link ${isActive('/rent') ? 'active' : ''}`}
                >
                  Rent
                </Link>
              </>
            )}

            {/* Navigation for admin */}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/add-property" 
                  className={`nav-link ${isActive('/admin/add-property') ? 'active' : ''}`}
                >
                  <FaPlus className="nav-icon" />
                  Add Property
                </Link>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                >
                  <FaChartBar className="nav-icon" />
                  Dashboard
                </Link>
              </>
            )}
            
            <Link 
              to="/properties" 
              className={`nav-link ${isActive('/properties') ? 'active' : ''}`}
            >
              <FaSearch className="nav-icon" />
              All Properties
            </Link>
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                >
                  <FaUser className="user-icon" />
                  <span className="user-name">{user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-menu">
                    <div className="user-info">
                      <p className="user-email">{user.email}</p>
                      {isAdmin && <span className="admin-badge">Admin</span>}
                    </div>
                    
                    {isAdmin && (
                      <>
                        <Link 
                          to="/admin/dashboard" 
                          className="user-menu-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaPlus className="menu-icon" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/add-property" 
                          className="user-menu-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaPlus className="menu-icon" />
                          Add Property
                        </Link>
                      </>
                    )}
                    
                    <button 
                      className="user-menu-link logout-btn"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="menu-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome className="nav-icon" />
              Home
            </Link>

            {/* Mobile Navigation for regular users */}
            {!isAdmin && (
              <>
                <Link 
                  to="/buy" 
                  className={`mobile-nav-link ${isActive('/buy') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy
                </Link>
                <Link 
                  to="/rent" 
                  className={`mobile-nav-link ${isActive('/rent') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rent
                </Link>
              </>
            )}

            {/* Mobile Navigation for admin */}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/add-property" 
                  className={`mobile-nav-link ${isActive('/admin/add-property') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPlus className="nav-icon" />
                  Add Property
                </Link>
                <Link 
                  to="/admin/dashboard" 
                  className={`mobile-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaChartBar className="nav-icon" />
                  Dashboard
                </Link>
              </>
            )}

            <Link 
              to="/properties" 
              className={`mobile-nav-link ${isActive('/properties') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSearch className="nav-icon" />
              All Properties
            </Link>
            
            {!user && (
              <div className="mobile-auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
