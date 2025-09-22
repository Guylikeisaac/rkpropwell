import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaBed, FaBath, FaUtensils, FaCar, FaSwimmingPool, 
  FaTree, FaShieldAlt, FaWifi, FaTv, FaSnowflake, FaFire,
  FaPlus, FaTrash, FaSave, FaMapMarkerAlt, FaPhone,
  FaUser, FaRulerCombined, FaBuilding
} from 'react-icons/fa';
import './SellProperty.css';

const SellProperty = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    type: 'sell',
    price: '',
    location: '',
    address: '',
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    area: '',
    builtYear: '',
    floor: '',
    totalFloors: '',
    facing: '',
    propertyType: '',
    
    // Amenities
    parking: '',
    balcony: '',
    garden: '',
    swimmingPool: false,
    gym: false,
    security: false,
    wifi: false,
    tv: false,
    ac: false,
    heating: false,
    lift: false,
    powerBackup: false,
    waterSupply: false,
    gasConnection: false,
    
    // Additional Features
    features: [],
    description: '',
    
    // Contact Information
    contact: '',
    owner: '',
    email: '',
    
    // Images
    images: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { addProperty } = useProperty();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        kitchens: parseInt(formData.kitchens) || 0,
        area: parseInt(formData.area) || 0,
        builtYear: parseInt(formData.builtYear) || 0,
        floor: parseInt(formData.floor) || 0,
        totalFloors: parseInt(formData.totalFloors) || 0,
        parking: parseInt(formData.parking) || 0,
        balcony: parseInt(formData.balcony) || 0,
        owner: user?.name || formData.owner,
        email: user?.email || formData.email
      };

      addProperty(propertyData);
      navigate('/properties');
    } catch (err) {
      setError('An error occurred while adding the property');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3 className="step-title">Basic Information</h3>
      
      <div className="form-group">
        <label className="form-label">
          <FaHome className="form-icon" />
          Property Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Beautiful 3BHK Apartment in Prime Location"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Property Type *</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">Independent House</option>
            <option value="penthouse">Penthouse</option>
            <option value="duplex">Duplex</option>
            <option value="studio">Studio</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Facing</label>
          <select
            name="facing"
            value={formData.facing}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Facing</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="northeast">Northeast</option>
            <option value="northwest">Northwest</option>
            <option value="southeast">Southeast</option>
            <option value="southwest">Southwest</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter expected price"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Built Year</label>
          <input
            type="number"
            name="builtYear"
            value={formData.builtYear}
            onChange={handleChange}
            className="form-input"
            placeholder="Year of construction"
            min="1900"
            max="2024"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <FaMapMarkerAlt className="form-icon" />
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Mumbai, Maharashtra"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Full Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Enter complete address"
          rows="3"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3 className="step-title">Property Details</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <FaBed className="form-icon" />
            Bedrooms
          </label>
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
          <label className="form-label">
            <FaBath className="form-icon" />
            Bathrooms
          </label>
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
          <label className="form-label">
            <FaUtensils className="form-icon" />
            Kitchens
          </label>
          <input
            type="number"
            name="kitchens"
            value={formData.kitchens}
            onChange={handleChange}
            className="form-input"
            placeholder="Number of kitchens"
            min="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <FaRulerCombined className="form-icon" />
            Area (sq ft)
          </label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="form-input"
            placeholder="Total area in square feet"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="form-icon" />
            Floor
          </label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="form-input"
            placeholder="Floor number"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Total Floors</label>
          <input
            type="number"
            name="totalFloors"
            value={formData.totalFloors}
            onChange={handleChange}
            className="form-input"
            placeholder="Total floors in building"
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Property Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Describe your property in detail..."
          rows="4"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3 className="step-title">Amenities & Features</h3>
      
      <div className="amenities-section">
        <h4 className="section-subtitle">Basic Amenities</h4>
        <div className="amenities-grid">
          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              <FaCar className="amenity-icon" />
              <span>Parking</span>
            </label>
            {formData.parking && (
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="amenity-input"
                placeholder="Number of parking spaces"
                min="0"
              />
            )}
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="balcony"
                checked={formData.balcony}
                onChange={handleChange}
              />
              <FaTree className="amenity-icon" />
              <span>Balcony</span>
            </label>
            {formData.balcony && (
              <input
                type="number"
                name="balcony"
                value={formData.balcony}
                onChange={handleChange}
                className="amenity-input"
                placeholder="Number of balconies"
                min="0"
              />
            )}
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="garden"
                checked={formData.garden}
                onChange={handleChange}
              />
              <FaTree className="amenity-icon" />
              <span>Garden</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="swimmingPool"
                checked={formData.swimmingPool}
                onChange={handleChange}
              />
              <FaSwimmingPool className="amenity-icon" />
              <span>Swimming Pool</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="gym"
                checked={formData.gym}
                onChange={handleChange}
              />
              <FaShieldAlt className="amenity-icon" />
              <span>Gym</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="security"
                checked={formData.security}
                onChange={handleChange}
              />
              <FaShieldAlt className="amenity-icon" />
              <span>24/7 Security</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.wifi}
                onChange={handleChange}
              />
              <FaWifi className="amenity-icon" />
              <span>WiFi</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="tv"
                checked={formData.tv}
                onChange={handleChange}
              />
              <FaTv className="amenity-icon" />
              <span>Cable TV</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="ac"
                checked={formData.ac}
                onChange={handleChange}
              />
              <FaSnowflake className="amenity-icon" />
              <span>Air Conditioning</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="heating"
                checked={formData.heating}
                onChange={handleChange}
              />
              <FaFire className="amenity-icon" />
              <span>Heating</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="lift"
                checked={formData.lift}
                onChange={handleChange}
              />
              <FaBuilding className="amenity-icon" />
              <span>Lift</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="powerBackup"
                checked={formData.powerBackup}
                onChange={handleChange}
              />
              <FaShieldAlt className="amenity-icon" />
              <span>Power Backup</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="waterSupply"
                checked={formData.waterSupply}
                onChange={handleChange}
              />
              <FaShieldAlt className="amenity-icon" />
              <span>24/7 Water Supply</span>
            </label>
          </div>

          <div className="amenity-item">
            <label className="amenity-label">
              <input
                type="checkbox"
                name="gasConnection"
                checked={formData.gasConnection}
                onChange={handleChange}
              />
              <FaFire className="amenity-icon" />
              <span>Gas Connection</span>
            </label>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h4 className="section-subtitle">Additional Features</h4>
        <div className="features-input">
          <div className="input-group">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="form-input"
              placeholder="Add a feature (e.g., Marble Flooring, Modular Kitchen)"
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
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3 className="step-title">Images & Contact Information</h3>
      
      <div className="images-section">
        <h4 className="section-subtitle">Property Images</h4>
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

      <div className="contact-section">
        <h4 className="section-subtitle">Contact Information</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FaUser className="form-icon" />
              Owner Name
            </label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="form-input"
              placeholder="Your name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <FaPhone className="form-icon" />
              Contact Number *
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="form-input"
              placeholder="Your contact number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Your email address"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="sell-property-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Sell Your Property</h1>
          <p className="page-subtitle">List your property and reach thousands of potential buyers</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="sell-property-form">
          {/* Progress Steps */}
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Property Details'}
                  {step === 3 && 'Amenities'}
                  {step === 4 && 'Images & Contact'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next Step
                </button>
              ) : (
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
                      List Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;
