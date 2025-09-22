import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { 
  FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaPhone, 
  FaHeart, FaShare, FaChevronLeft, FaChevronRight, FaUser,
  FaCalendarAlt, FaHome, FaKey
} from 'react-icons/fa';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = useProperty();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const property = getPropertyById(id);

  if (!property) {
    return (
      <div className="property-not-found">
        <div className="container">
          <h1>Property Not Found</h1>
          <p>The property you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/properties')} className="btn btn-primary">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price, type) => {
    if (type === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const getTypeIcon = () => {
    if (property.type === 'rent') return FaKey;
    return FaHome;
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className="property-details-page">
      <div className="container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaChevronLeft />
          Back
        </button>

        <div className="property-details-content">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
              />
              
              {property.images.length > 1 && (
                <>
                  <button className="nav-btn prev" onClick={prevImage}>
                    <FaChevronLeft />
                  </button>
                  <button className="nav-btn next" onClick={nextImage}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              <div className="image-counter">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="thumbnail-gallery">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="property-info">
            <div className="property-header">
              <div className="property-type">
                <TypeIcon className="type-icon" />
                <span className={`type-badge ${property.type}`}>
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </span>
              </div>
              
              <div className="property-actions">
                <button
                  className={`action-btn like ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart />
                </button>
                <button
                  className="action-btn share"
                  onClick={handleShare}
                  title="Share property"
                >
                  <FaShare />
                </button>
              </div>
            </div>

            <h1 className="property-title">{property.title}</h1>
            
            <div className="property-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{property.location}</span>
            </div>

            <div className="property-price">
              {formatPrice(property.price, property.type)}
            </div>

            <div className="property-details-grid">
              <div className="detail-item">
                <FaBed className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-value">{property.bedrooms}</span>
                  <span className="detail-label">Bedrooms</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaBath className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-value">{property.bathrooms}</span>
                  <span className="detail-label">Bathrooms</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaRulerCombined className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-value">{property.area}</span>
                  <span className="detail-label">Sq Ft</span>
                </div>
              </div>
            </div>

            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="property-features">
                <h3>Features</h3>
                <div className="features-grid">
                  {property.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-check">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="property-meta">
              <div className="meta-item">
                <FaUser className="meta-icon" />
                <div className="meta-content">
                  <span className="meta-label">Owner</span>
                  <span className="meta-value">{property.owner}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <div className="meta-content">
                  <span className="meta-label">Posted</span>
                  <span className="meta-value">
                    {new Date(property.datePosted).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <div className="contact-card">
              <h3 className="contact-title">Contact Owner</h3>
              
              <div className="contact-info">
                <div className="contact-item">
                  <FaUser className="contact-icon" />
                  <div>
                    <span className="contact-label">Owner</span>
                    <span className="contact-value">{property.owner}</span>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{property.contact}</span>
                  </div>
                </div>
              </div>

              <div className="contact-actions">
                <a href={`tel:${property.contact}`} className="btn btn-primary">
                  <FaPhone />
                  Call Now
                </a>
                <button className="btn btn-secondary">
                  Send Message
                </button>
              </div>
            </div>

            <div className="property-summary">
              <h4>Property Summary</h4>
              <div className="summary-item">
                <span>Type:</span>
                <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
              </div>
              <div className="summary-item">
                <span>Price:</span>
                <span>{formatPrice(property.price, property.type)}</span>
              </div>
              <div className="summary-item">
                <span>Location:</span>
                <span>{property.location}</span>
              </div>
              <div className="summary-item">
                <span>Size:</span>
                <span>{property.area} sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
