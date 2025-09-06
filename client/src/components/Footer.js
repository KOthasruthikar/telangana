import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Telangana Tourism" className="footer-logo-img" />
              <h3>Telangana Tourism</h3>
            </div>
            <p className="footer-description">
              Discover the rich heritage, vibrant culture, and breathtaking landscapes of Telangana. 
              Your gateway to unforgettable experiences in the heart of India.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/places">Places to Visit</Link></li>
              <li><Link to="/festivals">Festivals</Link></li>
              <li><Link to="/about">About Telangana</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Popular Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/places?district=Hyderabad">Hyderabad</Link></li>
              <li><Link to="/places?district=Warangal">Warangal</Link></li>
              <li><Link to="/places?district=Karimnagar">Karimnagar</Link></li>
              <li><Link to="/places?district=Nizamabad">Nizamabad</Link></li>
              <li><Link to="/places?district=Khammam">Khammam</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Telangana Tourism Development Corporation, Hyderabad, Telangana</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 40 2345 6789</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@telanganatourism.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Telangana Tourism. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
