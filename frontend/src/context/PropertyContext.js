import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { propertyAPI, heroAPI } from '../services/api';

const PropertyContext = createContext();

// Property reducer
const propertyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload, loading: false };
    case 'SET_FEATURED_PROPERTIES':
      return { ...state, featuredProperties: action.payload, loading: false };
    case 'SET_HERO_SLIDES':
      return { ...state, heroSlides: action.payload };
    case 'ADD_PROPERTY':
      return { 
        ...state, 
        properties: [...state.properties, action.payload],
        loading: false 
      };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(property =>
          property.id === action.payload.id ? action.payload : property
        ),
        loading: false
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(property => property.id !== action.payload),
        loading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: { type: '', location: '', priceRange: '', bedrooms: '' } };
    default:
      return state;
  }
};

const initialState = {
  properties: [],
  featuredProperties: [],
  heroSlides: [],
  loading: false,
  error: null,
  filters: {
    type: '',
    location: '',
    priceRange: '',
    bedrooms: ''
  }
};

export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  // Fetch all properties
  const fetchProperties = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.getProperties(filters);
      
      // Handle the response based on backend structure
      const properties = response.data.data?.items || response.data.properties || response.data || [];
      dispatch({ type: 'SET_PROPERTIES', payload: properties });
      
      return { success: true, data: properties };
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch properties';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fetch featured properties
  const fetchFeaturedProperties = async () => {
    try {
      const response = await propertyAPI.getFeaturedProperties();
      const featuredProperties = response.data.data?.items?.filter(p => p.isFeatured) || response.data.properties || response.data || [];
      dispatch({ type: 'SET_FEATURED_PROPERTIES', payload: featuredProperties });
      return featuredProperties;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }
  };

  // Load hero slides (from featured properties or static data)
  const loadHeroSlides = async () => {
    try {
      // Use the dedicated hero API endpoint
      const response = await heroAPI.getHeroSlides();
      const slides = response.data.data || response.data || [];
      
      dispatch({ type: 'SET_HERO_SLIDES', payload: slides });
      return slides;
    } catch (error) {
      console.error('Error loading hero slides:', error);
      
      // Fallback to default slides if API fails
      const defaultSlides = [
        {
          id: 'fallback-1',
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
          title: 'Find Your Dream Home',
          subtitle: 'Discover amazing properties in prime locations',
          description: 'Discover amazing properties in prime locations',
          price: null,
          location: 'Various Locations',
          link: '/properties',
          bulletPoints: ['Premium Locations', 'Best Prices', 'Quality Assured']
        }
      ];
      
      dispatch({ type: 'SET_HERO_SLIDES', payload: defaultSlides });
      return defaultSlides;
    }
  };

  // Get property by ID from local state
  const getPropertyById = (id) => {
    return state.properties.find(property => property.id === parseInt(id));
  };

  // Fetch property by ID from API
  const fetchPropertyById = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.getPropertyById(id);
      const property = response.data.property || response.data.data?.property || response.data;
      
      return property;
    } catch (error) {
      console.error('Error fetching property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch property details';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add new property
  const addProperty = async (propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.createProperty(propertyData);
      
      if (response.data.success || response.data.property) {
        const newProperty = response.data.property || response.data.data?.property;
        dispatch({ type: 'ADD_PROPERTY', payload: newProperty });
        
        // Refresh the properties list to get the latest data
        await fetchProperties();
        
        return { success: true, property: newProperty };
      }
      
      return { success: false, error: 'Failed to add property' };
    } catch (error) {
      console.error('Error adding property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add property';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update property
  const updateProperty = async (id, propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.updateProperty(id, propertyData);
      
      if (response.data.success || response.data.property) {
        const updatedProperty = response.data.property || response.data.data?.property;
        dispatch({ type: 'UPDATE_PROPERTY', payload: updatedProperty });
        return { success: true, property: updatedProperty };
      }
      
      return { success: false, error: 'Failed to update property' };
    } catch (error) {
      console.error('Error updating property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update property';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.deleteProperty(id);
      
      if (response.data.success !== false) {
        dispatch({ type: 'DELETE_PROPERTY', payload: id });
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete property' };
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete property';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Get user's properties
  const getUserProperties = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await propertyAPI.getUserProperties();
      const userProperties = response.data.properties || response.data.data?.properties || response.data || [];
      
      return userProperties;
    } catch (error) {
      console.error('Error fetching user properties:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch user properties';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Set error function for external use
  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Search properties by query
  const searchProperties = (query) => {
    if (!query) return state.properties;
    
    const searchTerm = query.toLowerCase();
    return state.properties.filter(property => 
      property.title?.toLowerCase().includes(searchTerm) ||
      property.description?.toLowerCase().includes(searchTerm) ||
      property.location?.toLowerCase().includes(searchTerm) ||
      property.city?.toLowerCase().includes(searchTerm) ||
      property.address?.toLowerCase().includes(searchTerm)
    );
  };

  // Filter properties by criteria
  const filterProperties = (filters) => {
    if (!filters || Object.keys(filters).length === 0) return state.properties;
    
    return state.properties.filter(property => {
      // Type filter
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      
      // Price range filter
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
        return false;
      }
      
      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) {
        return false;
      }
      
      // Bathrooms filter
      if (filters.bathrooms && property.bathrooms !== parseInt(filters.bathrooms)) {
        return false;
      }
      
      // Area filter
      if (filters.minArea && property.area < parseFloat(filters.minArea)) {
        return false;
      }
      if (filters.maxArea && property.area > parseFloat(filters.maxArea)) {
        return false;
      }
      
      // Location filter
      if (filters.location && !property.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Initialize data on mount
  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
    loadHeroSlides();
  }, []);

  const value = {
    properties: state.properties,
    featuredProperties: state.featuredProperties,
    heroSlides: state.heroSlides,
    loading: state.loading,
    error: state.error,
    fetchProperties,
    fetchFeaturedProperties,
    loadHeroSlides,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    fetchPropertyById,
    getUserProperties,
    setError,
    clearError,
    searchProperties,
    filterProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};

// Backward compatibility export
export const useProperty = usePropertyContext;

export default PropertyContext;
