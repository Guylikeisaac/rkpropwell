import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSearch, FaMapMarkerAlt, FaHome, FaBuilding, FaAngleRight, FaStar, FaPlus, FaChartBar } from 'react-icons/fa';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import './HeroSection.css';

const HeroSection = () => {
  const { heroSlides = [] } = useProperty();
  const { isAdmin } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('buy');
  const [searchLocation, setSearchLocation] = useState('');

  // Auto-advance slides
  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides]);

  const nextSlide = () => {
    if (!heroSlides || heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (!heroSlides || heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to properties page with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('type', searchType);
    
    window.location.href = `/properties?${params.toString()}`;
  };

  if (!heroSlides || heroSlides.length === 0) return null;
  
  // If user is admin, show admin welcome instead of hero section
  if (isAdmin) {
    return (
      <section className="admin-welcome-section">
        <div className="admin-welcome-container">
          <h1>Welcome to Admin Dashboard</h1>
          <p>Manage your properties and review analytics from here.</p>
          <div className="admin-quick-actions">
            <Link to="/admin/add-property" className="admin-action-btn">
              <FaPlus className="action-icon" />
              Add New Property
            </Link>
            <Link to="/admin/dashboard" className="admin-action-btn">
              <FaChartBar className="action-icon" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // For regular users, show the normal hero section
  return (
    <section className="hero-section">
      <div className="hero-slideshow">
        {(heroSlides || []).map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="container">
                <div className="hero-content">
                  <div className="hero-badge">
                    <FaStar className="badge-icon" />
                    <span>Premium Properties</span>
                  </div>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  
                  <div className="hero-features">
                    {(slide.bulletPoints || []).map((point, pointIndex) => (
                      <div key={pointIndex} className="feature-card">
                        <div className="feature-icon">
                          {pointIndex === 0 ? <FaHome /> : 
                           pointIndex === 1 ? <FaBuilding /> : 
                           pointIndex === 2 ? <FaStar /> : 
                           <FaAngleRight />}
                        </div>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="slide-nav prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="slide-nav next" onClick={nextSlide}>
          <FaChevronRight />
        </button>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {(heroSlides || []).map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="hero-search">
        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-header">
              <h2 className="search-title">Find Your Dream Home</h2>
              <p className="search-subtitle">Discover the perfect property that matches your lifestyle</p>
            </div>
            
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-row">
                <div className="search-group">
                  <label className="search-label">
                    <FaHome className="search-icon" />
                    I'm looking to
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-select"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div className="search-group">
                  <label className="search-label">
                    <FaMapMarkerAlt className="search-icon" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="City, neighborhood, or address"
                    className="search-input"
                  />
                </div>

                <div className="search-group">
                  <label className="search-label">
                    <FaSearch className="search-icon" />
                    Property
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="2BHK, Villa, Apartment, etc."
                    className="search-input"
                  />
                </div>

                <button type="submit" className="search-btn">
                  <FaSearch className="search-btn-icon" />
                  <span>Search Now</span>
                </button>
              </div>
            </form>
          </div>

          <div className="property-stats">
            <div className="stat-item">
              <div className="stat-circle">
                <span className="stat-number">150+</span>
              </div>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-circle">
                <span className="stat-number">100+</span>
              </div>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-circle">
                <span className="stat-number">50+</span>
              </div>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
