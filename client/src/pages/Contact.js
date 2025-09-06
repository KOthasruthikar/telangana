import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaStar, FaUser, FaCalendarAlt, FaImage } from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    place: '',
    festival: '',
    rating: 5,
    title: '',
    comment: '',
    images: []
  });

  const [errors, setErrors] = useState({});

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: 'Telangana Tourism Development Corporation\nHyderabad, Telangana 500001\nIndia'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+91 40 2345 6789\n+91 40 2345 6790'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'info@telanganatourism.com\nsupport@telanganatourism.com'
    }
  ];

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
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

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
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

  const validateContactForm = () => {
    const newErrors = {};

    if (!contactForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!contactForm.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!contactForm.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReviewForm = () => {
    const newErrors = {};

    if (!reviewForm.place && !reviewForm.festival) {
      newErrors.place = 'Please select a place or festival';
    }

    if (!reviewForm.title.trim()) {
      newErrors.title = 'Review title is required';
    }

    if (!reviewForm.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateContactForm()) {
      return;
    }

    setLoading(true);
    try {
      // In a real application, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage({
        type: 'success',
        text: 'Thank you for your message! We will get back to you soon.'
      });
      
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateReviewForm()) {
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        ...reviewForm,
        name: isAuthenticated ? user.name : 'Anonymous User',
        email: isAuthenticated ? user.email : 'noreply@telanganatourism.com'
      };

      await axios.post('/api/reviews/public', reviewData);
      
      setMessage({
        type: 'success',
        text: 'Thank you for your review! It has been submitted successfully.'
      });
      
      setReviewForm({
        place: '',
        festival: '',
        rating: 5,
        title: '',
        comment: '',
        images: []
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit review. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
            onClick={interactive ? () => onChange && onChange(star) : undefined}
            disabled={!interactive}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with us or share your travel experiences</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FaEnvelope />
            Contact Us
          </button>
          <button
            className={`tab ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <FaStar />
            Write Review
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have questions about Telangana tourism? Need help planning your trip? 
                We're here to help! Reach out to us through any of the following ways.
              </p>

              <div className="contact-methods">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="contact-method">
                      <div className="contact-icon">
                        <Icon />
                      </div>
                      <div className="contact-details">
                        <h3>{info.title}</h3>
                        <p>{info.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <FaUser />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
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
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                    placeholder="What's this about?"
                  />
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="review-content">
            <div className="review-info">
              <h2>Share Your Experience</h2>
              <p>
                Help other travelers by sharing your experiences visiting places and festivals in Telangana. 
                Your reviews help us improve and guide future visitors.
              </p>
              
              {!isAuthenticated && (
                <div className="login-prompt">
                  <p>Please <a href="/login">login</a> to submit a review.</p>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="review-form-container">
                <h2>Write a Review</h2>
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="form-group">
                    <label className="form-label">
                      What are you reviewing?
                    </label>
                    <div className="review-type-selection">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="reviewType"
                          value="place"
                          checked={reviewForm.place !== ''}
                          onChange={() => setReviewForm(prev => ({ ...prev, place: 'sample-place-id', festival: '' }))}
                        />
                        <span className="radio-custom"></span>
                        Place
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="reviewType"
                          value="festival"
                          checked={reviewForm.festival !== ''}
                          onChange={() => setReviewForm(prev => ({ ...prev, festival: 'sample-festival-id', place: '' }))}
                        />
                        <span className="radio-custom"></span>
                        Festival
                      </label>
                    </div>
                    {errors.place && <span className="form-error">{errors.place}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Rating
                    </label>
                    {renderStars(reviewForm.rating, true, (rating) => 
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                    {errors.rating && <span className="form-error">{errors.rating}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="title" className="form-label">
                      Review Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={reviewForm.title}
                      onChange={handleReviewFormChange}
                      className={`form-input ${errors.title ? 'error' : ''}`}
                      placeholder="Summarize your experience"
                    />
                    {errors.title && <span className="form-error">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment" className="form-label">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewFormChange}
                      className={`form-textarea ${errors.comment ? 'error' : ''}`}
                      placeholder="Share details about your experience..."
                      rows="6"
                    />
                    {errors.comment && <span className="form-error">{errors.comment}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaImage />
                      Photos (Optional)
                    </label>
                    <div className="image-upload">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="file-input"
                        onChange={(e) => {
                          // Handle file upload in a real application
                          console.log('Files selected:', e.target.files);
                        }}
                      />
                      <div className="upload-area">
                        <FaImage className="upload-icon" />
                        <p>Click to upload photos or drag and drop</p>
                        <span>PNG, JPG up to 10MB each</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
