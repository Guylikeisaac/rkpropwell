import React, { useState, useEffect } from 'react';
import { useProperty } from '../context/PropertyContext';
import { heroAPI, propertyAPI } from '../services/api';
import { FaPlus, FaTrash, FaEdit, FaSave, FaImage, FaTimes, FaStar } from 'react-icons/fa';
import './HeroEditor.css';

const HeroEditor = () => {
  const { heroSlides = [], loadHeroSlides, properties = [] } = useProperty();
  const [slides, setSlides] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSlides(heroSlides);
    loadAllProperties();
  }, [heroSlides]);

  const loadAllProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getProperties();
      const properties = response.data.data?.items || response.data || [];
      setAllProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyFeatured = async (propertyId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await heroAPI.updatePropertyFeatured(propertyId, newStatus);
      
      // Refresh hero slides and properties
      await loadHeroSlides();
      await loadAllProperties();
      
      alert(`Property ${newStatus ? 'added to' : 'removed from'} hero slideshow!`);
    } catch (error) {
      console.error('Error updating property featured status:', error);
      alert('Failed to update property. Please try again.');
    }
  };

  return (
    <div className="hero-editor">
      <div className="hero-editor-header">
        <h1>Hero Section Editor</h1>
        <p>Manage which properties appear in the hero slideshow by toggling their featured status</p>
      </div>

      {/* Current Hero Slides */}
      <div className="current-slides-section">
        <h3>Current Hero Slides ({slides.length})</h3>
        
        {slides.length === 0 ? (
          <div className="no-slides">
            <FaImage size={50} />
            <p>No hero slides available. Mark some properties as featured to add them to the slideshow!</p>
          </div>
        ) : (
          <div className="slides-grid">
            {slides.map((slide, index) => (
              <div key={slide.id} className="slide-card">
                <div className="slide-preview">
                  <img src={slide.image} alt={slide.title} />
                  <div className="slide-badge">
                    <FaStar /> Featured
                  </div>
                </div>
                
                <div className="slide-info">
                  <h4>{slide.title}</h4>
                  <p>{slide.subtitle}</p>
                  {slide.price && <span className="slide-price">{slide.price}</span>}
                  {slide.location && <span className="slide-location">{slide.location}</span>}
                  
                  <div className="bullet-points">
                    {slide.bulletPoints?.map((point, idx) => (
                      <span key={idx} className="bullet-point">• {point}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Management */}
      <div className="properties-section">
        <h3>All Properties - Toggle Featured Status</h3>
        
        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : (
          <div className="properties-grid">
            {allProperties.map((property) => (
              <div key={property.id} className={`property-card ${property.isFeatured ? 'featured' : ''}`}>
                <div className="property-preview">
                  <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'} 
                    alt={property.title} 
                  />
                  {property.isFeatured && (
                    <div className="featured-badge">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>
                
                <div className="property-info">
                  <h4>{property.title}</h4>
                  <p>{property.description?.substring(0, 100)}...</p>
                  <div className="property-details">
                    <span className="price">₹{Number(property.price).toLocaleString('en-IN')}</span>
                    <span className="location">{property.location}</span>
                  </div>
                  <div className="property-features">
                    <span>{property.bedrooms || 0} BHK</span>
                    <span>{property.area || 0} sq ft</span>
                    <span>{property.type}</span>
                  </div>
                  
                  <button 
                    className={`feature-toggle-btn ${property.isFeatured ? 'remove' : 'add'}`}
                    onClick={() => togglePropertyFeatured(property.id, property.isFeatured)}
                  >
                    <FaStar />
                    {property.isFeatured ? 'Remove from Hero' : 'Add to Hero'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroEditor;