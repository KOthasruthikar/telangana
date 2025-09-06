import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FaMapMarkerAlt },
    { path: '/places', label: 'Places', icon: FaMapMarkerAlt },
    { path: '/festivals', label: 'Festivals', icon: FaCalendarAlt },
    { path: '/about', label: 'About', icon: FaInfoCircle },
    { path: '/contact', label: 'Contact', icon: FaEnvelope }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Telangana Tourism" className="logo-img" />
          <span className="logo-text">Telangana Tourism</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="navbar-icon" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="profile-dropdown">
              <button
                className="profile-button"
                onClick={toggleProfile}
                aria-label="User profile"
              >
                <FaUser className="profile-icon" />
                <span className="profile-name">{user?.name}</span>
              </button>
              
              {isProfileOpen && (
                <div className="profile-menu">
                  <Link
                    to="/profile"
                    className="profile-menu-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUser className="menu-icon" />
                    Profile
                  </Link>
                  <button
                    className="profile-menu-item logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="menu-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
