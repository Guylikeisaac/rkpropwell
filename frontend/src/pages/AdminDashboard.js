import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import HeroEditor from './HeroEditor';
import { 
  FaHome, FaPlus, FaEdit, FaTrash, FaEye, FaChartBar, 
  FaBuilding, FaImage, FaCog, FaSignOutAlt, FaUser,
  FaEnvelope
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { properties = [], heroSlides = [], deleteProperty } = useProperty();
  const [activeTab, setActiveTab] = useState('overview');

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: FaBuilding,
      color: 'blue'
    },
    {
      title: 'Properties for Sale',
      value: Array.isArray(properties) ? properties.filter(p => p.type === 'sell').length : 0,
      icon: FaHome,
      color: 'green'
    },
    {
      title: 'Properties for Rent',
      value: Array.isArray(properties) ? properties.filter(p => p.type === 'rent').length : 0,
      icon: FaBuilding,
      color: 'orange'
    },
    {
      title: 'Active Users',
      value: '24', // This would come from your backend in a real app
      icon: FaUser,
      color: 'purple'
    },
    {
      title: 'Property Views',
      value: Array.isArray(properties) ? properties.reduce((acc, prop) => acc + (prop.views || 0), 0) : 0,
      icon: FaEye,
      color: 'teal'
    },
    {
      title: 'Recent Inquiries',
      value: '8', // This would come from your backend in a real app
      icon: FaEnvelope,
      color: 'pink'
    }
  ];

  const recentProperties = Array.isArray(properties) ? properties.slice(0, 5) : [];

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <stat.icon />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">Recent Properties</h3>
            <Link to="/admin/add-property" className="btn btn-primary btn-sm">
              <FaPlus />
              Add Property
            </Link>
          </div>
          
          <div className="properties-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Date Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="property-info">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="property-thumbnail"
                        />
                        <span className="property-title">{property.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${property.type}`}>
                        {property.type}
                      </span>
                    </td>
                    <td>
                      {property.type === 'rent' 
                        ? `₹${property.price.toLocaleString()}/month`
                        : `₹${property.price.toLocaleString()}`
                      }
                    </td>
                    <td>{property.location}</td>
                    <td>{new Date(property.datePosted).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/properties/${property.id}`}
                          className="action-btn view"
                          title="View Property"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          to={`/admin/edit-property/${property.id}`}
                          className="action-btn edit"
                          title="Edit Property"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="action-btn delete"
                          title="Delete Property"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">Hero Slideshow</h3>
            <Link to="/admin/edit-hero" className="btn btn-secondary btn-sm">
              <FaEdit />
              Edit Slides
            </Link>
          </div>
          
          <div className="hero-slides-preview">
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="slide-preview">
                <img src={slide.image} alt={slide.title} />
                <div className="slide-info">
                  <h4>{slide.title}</h4>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="dashboard-properties">
      <div className="section-header">
        <h3 className="section-title">All Properties</h3>
        <Link to="/admin/add-property" className="btn btn-primary">
          <FaPlus />
          Add New Property
        </Link>
      </div>
      
      <div className="properties-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Location</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Area</th>
              <th>Date Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(properties) ? properties : []).map((property) => (
              <tr key={property.id}>
                <td>
                  <div className="property-info">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="property-thumbnail"
                    />
                    <span className="property-title">{property.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${property.type}`}>
                    {property.type}
                  </span>
                </td>
                <td>
                  {property.type === 'rent' 
                    ? `₹${property.price.toLocaleString()}/month`
                    : `₹${property.price.toLocaleString()}`
                  }
                </td>
                <td>{property.location}</td>
                <td>{property.bedrooms}</td>
                <td>{property.bathrooms}</td>
                <td>{property.area} sq ft</td>
                <td>{new Date(property.datePosted).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link 
                      to={`/properties/${property.id}`}
                      className="action-btn view"
                      title="View Property"
                    >
                      <FaEye />
                    </Link>
                    <Link 
                      to={`/admin/edit-property/${property.id}`}
                      className="action-btn edit"
                      title="Edit Property"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="action-btn delete"
                      title="Delete Property"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          <p className="admin-welcome">Welcome, {user?.name}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartBar className="nav-icon" />
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <FaBuilding className="nav-icon" />
            Properties
          </button>
          <Link to="/admin/add-property" className="nav-item">
            <FaPlus className="nav-icon" />
            Add Property
          </Link>
          <button
            className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <FaImage className="nav-icon" />
            Hero Slideshow
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog className="nav-icon" />
            Settings
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt className="nav-icon" />
            Logout
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h1 className="content-title">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'properties' && 'Property Management'}
            {activeTab === 'hero' && 'Hero Slideshow Management'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
        </div>
        
        <div className="content-body">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'properties' && renderProperties()}
          {activeTab === 'hero' && <HeroEditor />}
          {activeTab === 'settings' && (
            <div className="settings-management">
              <h3>Settings</h3>
              <p>Configure website settings and preferences.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
