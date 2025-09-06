import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useFestivals } from '../contexts/FestivalsContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaPhone, FaEnvelope, FaShare, FaHeart, FaUsers } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './FestivalDetail.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FestivalDetail = () => {
  const { id } = useParams();
  const { currentFestival, loading, error, fetchFestivalById } = useFestivals();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchFestivalById(id);
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const isUpcoming = (festival) => {
    return new Date(festival.date.start) > new Date();
  };

  const isOngoing = (festival) => {
    const now = new Date();
    return now >= new Date(festival.date.start) && now <= new Date(festival.date.end);
  };

  const getFestivalStatus = (festival) => {
    if (isUpcoming(festival)) return 'upcoming';
    if (isOngoing(festival)) return 'ongoing';
    return 'past';
  };

  if (loading) {
    return (
      <div className="festival-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading festival details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentFestival) {
    return (
      <div className="festival-detail-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Festival Not Found</h2>
            <p className="error-message">{error || 'The festival you are looking for does not exist.'}</p>
            <Link to="/festivals" className="btn btn-primary">
              Back to Festivals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getFestivalStatus(currentFestival);

  return (
    <div className="festival-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/festivals">Festivals</Link>
          <span>/</span>
          <span>{currentFestival.name}</span>
        </nav>

        {/* Festival Header */}
        <div className="festival-header">
          <div className="festival-title-section">
            <div className="festival-status">
              <span className={`status-badge ${status}`}>
                {status === 'upcoming' ? 'Upcoming' : status === 'ongoing' ? 'Ongoing' : 'Past'}
              </span>
            </div>
            <h1 className="festival-title">{currentFestival.name}</h1>
            <div className="festival-location">
              <FaMapMarkerAlt />
              <span>{currentFestival.location.address}, {currentFestival.location.district}</span>
            </div>
            <div className="festival-dates">
              <FaCalendarAlt />
              <span>
                {formatDate(currentFestival.date.start)} - {formatDate(currentFestival.date.end)}
                <span className="duration">({formatDuration(currentFestival.date.start, currentFestival.date.end)} days)</span>
              </span>
            </div>
          </div>
          
          <div className="festival-actions">
            <button className="action-btn">
              <FaShare />
              Share
            </button>
            <button className="action-btn">
              <FaHeart />
              Save
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        {currentFestival.images && currentFestival.images.length > 0 && (
          <div className="image-gallery">
            <div className="main-image">
              <img
                src={currentFestival.images[activeImageIndex]?.url || '/images/placeholder.jpg'}
                alt={currentFestival.name}
              />
            </div>
            {currentFestival.images.length > 1 && (
              <div className="image-thumbnails">
                {currentFestival.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image.url} alt={`${currentFestival.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Festival Details */}
        <div className="festival-details">
          <div className="details-main">
            <div className="description-section">
              <h2>About {currentFestival.name}</h2>
              <p className="description">{currentFestival.description}</p>
            </div>

            <div className="significance-section">
              <h3>Significance</h3>
              <p>{currentFestival.significance}</p>
            </div>

            {currentFestival.rituals && currentFestival.rituals.length > 0 && (
              <div className="rituals-section">
                <h3>Rituals & Traditions</h3>
                <div className="rituals-list">
                  {currentFestival.rituals.map((ritual, index) => (
                    <div key={index} className="ritual-item">
                      <h4>{ritual.name}</h4>
                      <p>{ritual.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentFestival.specialAttractions && currentFestival.specialAttractions.length > 0 && (
              <div className="attractions-section">
                <h3>Special Attractions</h3>
                <div className="attractions-grid">
                  {currentFestival.specialAttractions.map((attraction, index) => (
                    <div key={index} className="attraction-item">
                      {attraction}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <FaClock className="info-icon" />
                <div className="info-content">
                  <h4>Timings</h4>
                  <p>{currentFestival.timings}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaMoneyBillWave className="info-icon" />
                <div className="info-content">
                  <h4>Entry Fee</h4>
                  <p>{currentFestival.entryFee}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaUsers className="info-icon" />
                <div className="info-content">
                  <h4>Category</h4>
                  <p>{currentFestival.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="details-sidebar">
            {/* Map */}
            <div className="map-section">
              <h3>Location</h3>
              <div className="map-container">
                <MapContainer
                  center={[currentFestival.location.coordinates[1], currentFestival.location.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[currentFestival.location.coordinates[1], currentFestival.location.coordinates[0]]}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h4>{currentFestival.name}</h4>
                        <p>{currentFestival.location.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Contact Information */}
            {currentFestival.contactInfo && (
              <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  {currentFestival.contactInfo.organizer && (
                    <div className="contact-item">
                      <FaUsers className="contact-icon" />
                      <div className="contact-details">
                        <h4>Organizer</h4>
                        <p>{currentFestival.contactInfo.organizer}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFestival.contactInfo.phone && (
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <div className="contact-details">
                        <h4>Phone</h4>
                        <p>{currentFestival.contactInfo.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFestival.contactInfo.email && (
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <div className="contact-details">
                        <h4>Email</h4>
                        <p>{currentFestival.contactInfo.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Festivals */}
            <div className="related-festivals">
              <h3>Related Festivals</h3>
              <div className="related-list">
                <Link to="/festivals" className="related-item">
                  <img src="/images/bathukamma-festival.jpg" alt="Bathukamma Festival" />
                  <div className="related-content">
                    <h4>Bathukamma Festival</h4>
                    <p>Cultural Festival</p>
                  </div>
                </Link>
                <Link to="/festivals" className="related-item">
                  <img src="/images/sammakka-jatara.jpg" alt="Sammakka Jatara" />
                  <div className="related-content">
                    <h4>Sammakka Saralamma Jatara</h4>
                    <p>Traditional Festival</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetail;
