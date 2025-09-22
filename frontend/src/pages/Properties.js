import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaMapMarkerAlt, FaHome, FaKey } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/PropertyContext';
import './Properties.css';

const Properties = ({ type }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, filterProperties, searchProperties } = useProperty();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    type: type || searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || ''
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    let result = properties;

    // Apply search query
    if (searchQuery) {
      result = searchProperties(searchQuery);
    }

    // Apply filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    if (Object.keys(activeFilters).length > 0) {
      result = filterProperties(activeFilters);
    }

    // Apply sorting
    result = sortProperties(result, sortBy);

    setFilteredProperties(result);
  }, [properties, searchQuery, filters, sortBy, searchProperties, filterProperties]);

  const sortProperties = (properties, sortOption) => {
    const sorted = [...properties];
    
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted));
      case 'area-large':
        return sorted.sort((a, b) => b.area - a.area);
      case 'area-small':
        return sorted.sort((a, b) => a.area - b.area);
      default:
        return sorted;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: type || '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: ''
    });
    setSearchQuery('');
    setLocation('');
    setSortBy('newest');
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('q', searchQuery);
    if (location) params.append('location', location);
    if (filters.type) params.append('type', filters.type);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
    if (filters.minArea) params.append('minArea', filters.minArea);
    if (filters.maxArea) params.append('maxArea', filters.maxArea);
    if (sortBy) params.append('sort', sortBy);
    
    setSearchParams(params);
  };

  const getPageTitle = () => {
    if (type === 'buy') return 'Properties for Sale';
    if (type === 'rent') return 'Properties for Rent';
    if (type === 'sell') return 'Properties for Sale';
    return 'All Properties';
  };

  const getPageIcon = () => {
    if (type === 'buy' || type === 'sell') return FaHome;
    if (type === 'rent') return FaKey;
    return FaHome;
  };

  const PageIcon = getPageIcon();

  return (
    <div className="properties-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-section">
            <div className="page-icon">
              <PageIcon />
            </div>
            <div>
              <h1 className="page-title">{getPageTitle()}</h1>
              <p className="page-subtitle">
                {filteredProperties.length} properties found
              </p>
            </div>
          </div>
          
          <div className="page-actions">
            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="search-group">
                <FaMapMarkerAlt className="search-icon" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button type="submit" className="search-btn">
                <FaSearch />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Min Area (sq ft)</label>
                <input
                  type="number"
                  placeholder="Min Area"
                  value={filters.minArea}
                  onChange={(e) => handleFilterChange('minArea', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Area (sq ft)</label>
                <input
                  type="number"
                  placeholder="Max Area"
                  value={filters.maxArea}
                  onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-actions">
                <button type="button" className="btn btn-outline" onClick={clearFilters}>
                  Clear Filters
                </button>
                <button type="button" className="btn btn-primary" onClick={updateURL}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sort and Results */}
        <div className="results-section">
          <div className="results-header">
            <div className="results-info">
              <span className="results-count">
                Showing {filteredProperties.length} properties
              </span>
            </div>
            
            <div className="sort-section">
              <FaSort className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="area-large">Area: Large to Small</option>
                <option value="area-small">Area: Small to Large</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <FaHome />
              </div>
              <h3 className="no-results-title">No Properties Found</h3>
              <p className="no-results-message">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
