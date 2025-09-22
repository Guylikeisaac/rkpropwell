import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import './AddProperty.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, updateProperty } = useProperty();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'buy',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: [],
    contact: '',
    owner: '',
    images: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const property = getPropertyById(id);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        type: property.type || 'buy',
        price: property.price || '',
        location: property.location || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        description: property.description || '',
        features: property.features || [],
        contact: property.contact || '',
        owner: property.owner || '',
        images: property.images || []
      });
    }
  }, [property]);

  if (!property) {
    return (
      <div className="property-not-found">
        <div className="container">
          <h1>Property Not Found</h1>
          <p>The property you're trying to edit doesn't exist.</p>
          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.price || !formData.location) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError('Please add at least one image');
      setLoading(false);
      return;
    }

    try {
      const propertyData = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseInt(formData.area) || 0
      };

      updateProperty(id, propertyData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('An error occurred while updating the property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Edit Property</h1>
          <p className="page-subtitle">Update property information</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form className="property-form" onSubmit={handleSubmit}>
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Property Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter property title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter price"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="form-section">
              <h3 className="section-title">Property Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Number of bedrooms"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Number of bathrooms"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Area (sq ft)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Area in square feet"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-section">
              <h3 className="section-title">Description</h3>
              
              <div className="form-group">
                <label className="form-label">Property Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe the property in detail"
                  rows="4"
                />
              </div>
            </div>

            {/* Features */}
            <div className="form-section">
              <h3 className="section-title">Features</h3>
              
              <div className="features-input">
                <div className="input-group">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="form-input"
                    placeholder="Add a feature (e.g., Swimming Pool, Garden)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="btn btn-secondary"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="features-list">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="remove-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="form-section">
              <h3 className="section-title">Property Images</h3>
              
              <div className="images-input">
                <div className="input-group">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="form-input"
                    placeholder="Enter image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="btn btn-secondary"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="images-list">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Property ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="remove-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Contact number"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner Name</label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Property owner name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FaSave />
                  Update Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
