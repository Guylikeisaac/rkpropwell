import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaShare, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property, showActions = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price, type) => {
    if (type === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleImageClick = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/properties/${property.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`);
      alert('Property link copied to clipboard!');
    }
  };

  return (
    <div className="property-card">
      <Link to={`/properties/${property.id}`} className="property-link">
        {/* Image Section */}
        <div className="property-image-container">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="property-image"
            onClick={handleImageClick}
          />
          
          {/* Image Navigation Dots */}
          {property.images.length > 1 && (
            <div className="image-dots">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  className={`image-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}

          {/* Property Type Badge */}
          <div className={`property-type-badge ${property.type}`}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="property-actions">
              <button
                className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart />
              </button>
              <button
                className="action-btn share-btn"
                onClick={handleShare}
                title="Share property"
              >
                <FaShare />
              </button>
            </div>
          )}

          {/* Price Overlay */}
          <div className="price-overlay">
            <span className="property-price">
              {formatPrice(property.price, property.type)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="property-content">
          <h3 className="property-title">{property.title}</h3>
          
          <div className="property-location">
            <FaMapMarkerAlt className="location-icon" />
            <span>{property.location}</span>
          </div>

          <div className="property-details">
            <div className="detail-item">
              <FaBed className="detail-icon" />
              <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="detail-item">
              <FaBath className="detail-icon" />
              <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="detail-item">
              <FaRulerCombined className="detail-icon" />
              <span>{property.area} sq ft</span>
            </div>
          </div>

          <p className="property-description">
            {property.description.length > 100 
              ? `${property.description.substring(0, 100)}...` 
              : property.description
            }
          </p>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="property-features">
              {property.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="feature-tag more">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Contact Button */}
          <div className="property-footer">
            <button className="contact-btn">
              <FaPhone className="contact-icon" />
              Contact Owner
            </button>
            <span className="posted-date">
              Posted {new Date(property.datePosted).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
