import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaStar, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reviews, setReviews] = useState([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchUserReviews();
    }
  }, [activeTab]);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get('/api/users/reviews');
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile(profileForm);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
        setIsEditing(false);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update profile'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Password changed successfully!'
        });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to change password'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to change password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and view your activity</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser />
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FaEdit />
            Change Password
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <FaStar />
            My Reviews
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-avatar">
                <FaUser className="avatar-icon" />
              </div>
              <div className="profile-details">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <span className="user-role">{user?.role}</span>
              </div>
            </div>

            <div className="profile-form-container">
              <div className="form-header">
                <h2>Edit Profile</h2>
                <button
                  className="edit-toggle"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <FaTimes /> : <FaEdit />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <FaUser />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileFormChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileFormChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      <FaSave />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="password-content">
            <div className="password-form-container">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                    className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="Enter your current password"
                  />
                  {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter your new password"
                  />
                  {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your new password"
                  />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="reviews-content">
            <div className="reviews-header">
              <h2>My Reviews</h2>
              <p>Reviews you've written for places and festivals</p>
            </div>

            {reviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <h3>No Reviews Yet</h3>
                <p>You haven't written any reviews yet. Start exploring and share your experiences!</p>
                <a href="/places" className="btn btn-primary">
                  Explore Places
                </a>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <h3>{review.title}</h3>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="rating-text">{review.rating}/5</span>
                      </div>
                    </div>
                    
                    <p className="review-comment">{review.comment}</p>
                    
                    <div className="review-meta">
                      <div className="review-location">
                        {review.place && (
                          <>
                            <FaMapMarkerAlt />
                            <span>{review.place.name}</span>
                          </>
                        )}
                        {review.festival && (
                          <>
                            <FaCalendarAlt />
                            <span>{review.festival.name}</span>
                          </>
                        )}
                      </div>
                      <div className="review-date">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
