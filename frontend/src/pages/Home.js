import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaKey, FaChartLine, FaUsers, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/PropertyContext';
import './Home.css';

const Home = () => {
  const { properties = [], featuredProperties = [] } = useProperty();

  // Get featured properties (first 6 properties) - use featuredProperties if available, otherwise slice from properties
  const displayFeaturedProperties = featuredProperties.length > 0 
    ? featuredProperties.slice(0, 6) 
    : (Array.isArray(properties) ? properties.slice(0, 6) : []);

  const stats = [
    { number: '10,000+', label: 'Properties Listed', icon: FaHome },
    { number: '50,000+', label: 'Happy Customers', icon: FaUsers },
    { number: '500+', label: 'Cities Covered', icon: FaChartLine },
    { number: '24/7', label: 'Customer Support', icon: FaHeadset }
  ];

  const services = [
    {
      icon: FaHome,
      title: 'Buy Property',
      description: 'Find your dream home from our extensive collection of verified properties.',
      link: '/buy',
      color: 'red'
    },
    {
      icon: FaKey,
      title: 'Rent Property',
      description: 'Discover rental properties that match your budget and preferences.',
      link: '/rent',
      color: 'green'
    },
    {
      icon: FaChartLine,
      title: 'Sell Property',
      description: 'List your property and get the best value with our expert guidance.',
      link: '/sell',
      color: 'blue'
    },
    {
      icon: FaShieldAlt,
      title: 'Property Management',
      description: 'Professional property management services for landlords and investors.',
      link: '#',
      color: 'purple'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <stat.icon />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="service-card">
                <div className={`service-icon ${service.color}`}>
                  <service.icon />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          
          <div className="properties-grid">
            {displayFeaturedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/properties" className="btn btn-primary btn-lg">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-content">
            <div className="why-choose-text">
              <h2 className="section-title">Why Choose RK Propwell?</h2>
              <p className="section-subtitle">
                We are committed to providing exceptional real estate services with integrity and professionalism.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="feature-content">
                    <h4>Verified Properties</h4>
                    <p>All our properties are thoroughly verified for authenticity and legal compliance.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaUsers />
                  </div>
                  <div className="feature-content">
                    <h4>Expert Team</h4>
                    <p>Our experienced team provides personalized guidance throughout your property journey.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaChartLine />
                  </div>
                  <div className="feature-content">
                    <h4>Best Deals</h4>
                    <p>We negotiate the best prices and terms for our clients to ensure maximum value.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaHeadset />
                  </div>
                  <div className="feature-content">
                    <h4>24/7 Support</h4>
                    <p>Round-the-clock customer support to address all your queries and concerns.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="why-choose-image">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                alt="Professional real estate team"
                className="feature-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Dream Property?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied customers who found their perfect home with us.
            </p>
            <div className="cta-buttons">
              <Link to="/properties" className="btn btn-primary btn-lg">
                Browse Properties
              </Link>
              <Link to="/sell-property" className="btn btn-secondary btn-lg">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
