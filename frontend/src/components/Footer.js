import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { isAdmin } = useAuth();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">RK Propwell</h3>
            <p className="footer-description">
              Your trusted partner in real estate. We help you find, buy, sell, and rent properties with confidence and ease.
            </p>
            <div className="social-links">
              <button className="social-link" aria-label="Facebook">
                <FaFacebook />
              </button>
              <button className="social-link" aria-label="Twitter">
                <FaTwitter />
              </button>
              <button className="social-link" aria-label="Instagram">
                <FaInstagram />
              </button>
              <button className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/buy" className="footer-link">Buy Property</Link></li>
              <li><Link to="/rent" className="footer-link">Rent Property</Link></li>
              {isAdmin && (
                <li><Link to="/sell" className="footer-link">Sell Property</Link></li>
              )}
              <li><Link to="/properties" className="footer-link">All Properties</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><button className="footer-link">Property Valuation</button></li>
              <li><button className="footer-link">Legal Support</button></li>
              <li><button className="footer-link">Home Loans</button></li>
              <li><button className="footer-link">Property Management</button></li>
              <li><button className="footer-link">Investment Advisory</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Property Street, Real Estate City, 12345</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@rkpropwell.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 RK Propwell. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <button className="footer-bottom-link">Privacy Policy</button>
              <button className="footer-bottom-link">Terms of Service</button>
              <button className="footer-bottom-link">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
