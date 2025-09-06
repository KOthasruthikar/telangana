import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { usePlaces } from '../contexts/PlacesContext';
import { useAuth } from '../contexts/AuthContext';
import { FaMapMarkerAlt, FaStar, FaClock, FaMoneyBillWave, FaPhone, FaEnvelope, FaRoute, FaDirections, FaShare, FaHeart } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PlaceDetail.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PlaceDetail = () => {
  const { id } = useParams();
  const { currentPlace, loading, error, fetchPlaceById, fetchNearbyPlaces } = usePlaces();
  const { isAuthenticated } = useAuth();
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [loadingDirections, setLoadingDirections] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlaceById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentPlace) {
      // Fetch nearby places
      fetchNearbyPlaces(
        currentPlace.location.coordinates[1],
        currentPlace.location.coordinates[0],
        50
      ).then(setNearbyPlaces);

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
  }, [currentPlace]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const handleGetDirections = async () => {
    if (!userLocation) {
      alert('Please allow location access to get directions');
      return;
    }

    if (currentPlace) {
      setLoadingDirections(true);
      try {
        const { coordinates } = currentPlace.location;
        const startLat = userLocation.lat;
        const startLng = userLocation.lng;
        const endLat = coordinates[1];
        const endLng = coordinates[0];
        
        // Use OpenRouteService API for real road routing
        // Free API key - you can get your own at https://openrouteservice.org/
        const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248a8b8b8b8&start=${startLng},${startLat}&end=${endLng},${endLat}&format=geojson`);
        const data = await response.json();
        
        if (data.features && data.features[0]) {
          const routeData = data.features[0];
          const routeCoordinates = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          
          setRoute(routeCoordinates);
          setShowRoute(true);
          
          // Extract real route instructions
          const instructions = [];
          const distance = (routeData.properties.summary.distance / 1000).toFixed(1);
          const duration = Math.round(routeData.properties.summary.duration / 60);
          
          instructions.push(`Start from your current location`);
          instructions.push(`Head towards ${currentPlace.name}`);
          instructions.push(`Distance: ${distance} km`);
          instructions.push(`Estimated travel time: ${duration} minutes by car`);
          
          // Add turn-by-turn directions if available
          if (routeData.properties.segments && routeData.properties.segments[0]) {
            const steps = routeData.properties.segments[0].steps;
            steps.slice(0, 5).forEach((step, index) => {
              if (step.instruction) {
                instructions.push(`${index + 1}. ${step.instruction}`);
              }
            });
          }
          
          setRouteInstructions(instructions);
        } else {
          // Fallback to straight line if API fails
          const routePoints = [
            [startLat, startLng],
            [endLat, endLng]
          ];
          setRoute(routePoints);
          setShowRoute(true);
          
          const distance = getDistance();
          const instructions = [
            `Start from your current location`,
            `Head towards ${currentPlace.name}`,
            `Distance: ${distance} km`,
            `Estimated travel time: ${Math.round(distance * 2)} minutes by car`
          ];
          setRouteInstructions(instructions);
        }
      } catch (error) {
        console.error('Error getting directions:', error);
        // Fallback to straight line
        const { coordinates } = currentPlace.location;
        const routePoints = [
          [userLocation.lat, userLocation.lng],
          [coordinates[1], coordinates[0]]
        ];
        setRoute(routePoints);
        setShowRoute(true);
        
        const distance = getDistance();
        const instructions = [
          `Start from your current location`,
          `Head towards ${currentPlace.name}`,
          `Distance: ${distance} km`,
          `Estimated travel time: ${Math.round(distance * 2)} minutes by car`
        ];
        setRouteInstructions(instructions);
      } finally {
        setLoadingDirections(false);
      }
    }
  };

  const getDistance = () => {
    if (!userLocation || !currentPlace) return null;
    
    const { coordinates } = currentPlace.location;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      coordinates[1],
      coordinates[0]
    );
    
    return distance.toFixed(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPlace.name,
          text: currentPlace.shortDescription,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="place-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading place details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentPlace) {
    return (
      <div className="place-detail-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Place Not Found</h2>
            <p className="error-message">{error || 'The place you are looking for does not exist.'}</p>
            <Link to="/places" className="btn btn-primary">
              Back to Places
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="place-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/places">Places</Link>
          <span>/</span>
          <span>{currentPlace.name}</span>
        </nav>

        {/* Place Header */}
        <div className="place-header">
          <div className="place-title-section">
            <h1 className="place-title">{currentPlace.name}</h1>
            <div className="place-location">
              <FaMapMarkerAlt />
              <span>{currentPlace.location.address}, {currentPlace.location.district}</span>
            </div>
            <div className="place-rating">
              <div className="rating-stars">
                {renderStars(currentPlace.rating.average)}
              </div>
              <span className="rating-text">
                {currentPlace.rating.average.toFixed(1)} ({currentPlace.rating.count} reviews)
              </span>
            </div>
          </div>
          
          <div className="place-actions">
            <button className="action-btn" onClick={handleShare}>
              <FaShare />
              Share
            </button>
            {isAuthenticated && (
              <button className="action-btn">
                <FaHeart />
                Save
              </button>
            )}
            <button className="action-btn primary" onClick={handleGetDirections}>
              <FaDirections />
              Get Directions
            </button>
          </div>
          
          {/* Distance Display */}
          {userLocation && (
            <div className="distance-info">
              <div className="distance-card">
                <FaMapMarkerAlt className="distance-icon" />
                <div className="distance-details">
                  <span className="distance-value">{getDistance()} km</span>
                  <span className="distance-label">from your location</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {currentPlace.images && currentPlace.images.length > 0 && (
          <div className="image-gallery">
            <div className="main-image">
              <img
                src={currentPlace.images[activeImageIndex]?.url || '/images/placeholder.jpg'}
                alt={currentPlace.name}
              />
            </div>
            {currentPlace.images.length > 1 && (
              <div className="image-thumbnails">
                {currentPlace.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image.url} alt={`${currentPlace.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Place Details */}
        <div className="place-details">
          <div className="details-main">
            <div className="description-section">
              <h2>About {currentPlace.name}</h2>
              <p className="description">{currentPlace.description}</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <FaClock className="info-icon" />
                <div className="info-content">
                  <h4>Timings</h4>
                  <p>{currentPlace.timings}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaMoneyBillWave className="info-icon" />
                <div className="info-content">
                  <h4>Entry Fee</h4>
                  <p>{currentPlace.entryFee}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaStar className="info-icon" />
                <div className="info-content">
                  <h4>Best Time to Visit</h4>
                  <p>{currentPlace.bestTimeToVisit}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <h4>Category</h4>
                  <p>{currentPlace.category}</p>
                </div>
              </div>
            </div>

            {currentPlace.facilities && currentPlace.facilities.length > 0 && (
              <div className="facilities-section">
                <h3>Facilities</h3>
                <div className="facilities-grid">
                  {currentPlace.facilities.map((facility, index) => (
                    <div key={index} className="facility-item">
                      {facility}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="details-sidebar">
            {/* Map */}
            <div className="map-section">
              <h3>Location</h3>
              <div className="map-container">
                <MapContainer
                  center={[currentPlace.location.coordinates[1], currentPlace.location.coordinates[0]]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h4>Your Location</h4>
                          <p>Starting point</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Place Marker */}
                  <Marker
                    position={[currentPlace.location.coordinates[1], currentPlace.location.coordinates[0]]}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h4>{currentPlace.name}</h4>
                        <p>{currentPlace.location.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Route Line */}
                  {showRoute && route && (
                    <Polyline
                      positions={route}
                      color="#667eea"
                      weight={5}
                      opacity={0.8}
                      dashArray="10, 10"
                    />
                  )}
                </MapContainer>
              </div>
              <button 
                className="btn btn-primary full-width" 
                onClick={handleGetDirections}
                disabled={loadingDirections}
              >
                <FaRoute />
                {loadingDirections ? 'Getting Directions...' : 'Get Directions'}
              </button>
              
              {/* Route Instructions */}
              {showRoute && routeInstructions.length > 0 && (
                <div className="route-instructions">
                  <h4>Route Instructions</h4>
                  <div className="instructions-list">
                    {routeInstructions.map((instruction, index) => (
                      <div key={index} className="instruction-item">
                        <span className="step-number">{index + 1}</span>
                        <span className="instruction-text">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nearby Places */}
            {nearbyPlaces.length > 0 && (
              <div className="nearby-places">
                <h3>Nearby Places</h3>
                <div className="nearby-list">
                  {nearbyPlaces.slice(0, 5).map((place) => (
                    <Link key={place._id} to={`/places/${place._id}`} className="nearby-item">
                      <img
                        src={place.primaryImage || '/images/placeholder.jpg'}
                        alt={place.name}
                        className="nearby-image"
                      />
                      <div className="nearby-content">
                        <h4>{place.name}</h4>
                        <p>{place.location.district}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
