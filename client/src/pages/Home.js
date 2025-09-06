import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { usePlaces } from '../contexts/PlacesContext';
import { useFestivals } from '../contexts/FestivalsContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaArrowRight, FaSearch, FaFilter } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Home = () => {
  const { featuredPlaces, fetchFeaturedPlaces, loading: placesLoading } = usePlaces();
  const { upcomingFestivals, fetchUpcomingFestivals, loading: festivalsLoading } = useFestivals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchFeaturedPlaces();
    fetchUpcomingFestivals();
  }, []);

  const categories = [
    'Historical', 'Religious', 'Natural', 'Cultural', 'Adventure', 'Wildlife', 'Architecture'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/places?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    window.location.href = `/places?category=${encodeURIComponent(category)}`;
  };

  // Telangana center coordinates
  const telanganaCenter = [17.3850, 78.4867]; // Hyderabad coordinates

  // Sample places for map (you can replace with actual data)
  const mapPlaces = featuredPlaces.length > 0 ? featuredPlaces : [
    {
      _id: '1',
      name: 'Charminar',
      location: { coordinates: [78.4747, 17.3616] },
      category: 'Historical',
      shortDescription: 'Iconic monument of Hyderabad',
      primaryImage: '/images/charminar.jpg'
    },
    {
      _id: '2',
      name: 'Golconda Fort',
      location: { coordinates: [78.4011, 17.3833] },
      category: 'Historical',
      shortDescription: 'Ancient fort with rich history',
      primaryImage: '/images/golconda.jpg'
    },
    {
      _id: '3',
      name: 'Warangal Fort',
      location: { coordinates: [79.6029, 17.9689] },
      category: 'Historical',
      shortDescription: 'Kakatiya dynasty fort',
      primaryImage: '/images/warangal-fort.jpg'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Telangana</h1>
          <p>Discover the rich heritage, vibrant culture, and breathtaking landscapes of Telangana. Your gateway to unforgettable experiences in the heart of India.</p>
          
          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search places, festivals, or districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="category-filters">
            <FaFilter className="filter-icon" />
            <span className="filter-label">Explore by category:</span>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore Telangana on Map</h2>
          <p className="section-subtitle">
            Click on the markers to discover amazing places across Telangana
          </p>
          
          <div className="map-container">
            <MapContainer
              center={telanganaCenter}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {mapPlaces.map((place) => (
                <Marker
                  key={place._id}
                  position={[place.location.coordinates[1], place.location.coordinates[0]]}
                >
                  <Popup>
                    <div className="map-popup">
                      <img 
                        src={place.primaryImage || '/images/placeholder.jpg'} 
                        alt={place.name}
                        className="popup-image"
                      />
                      <h3 className="popup-title">{place.name}</h3>
                      <p className="popup-description">{place.shortDescription}</p>
                      <div className="popup-meta">
                        <span className="popup-category">{place.category}</span>
                      </div>
                      <Link 
                        to={`/places/${place._id}`} 
                        className="popup-link"
                      >
                        View Details <FaArrowRight />
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className="section featured-places">
        <div className="container">
          <h2 className="section-title">Featured Places</h2>
          <p className="section-subtitle">
            Discover the most popular and must-visit destinations in Telangana
          </p>
          
          {placesLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading featured places...</span>
            </div>
          ) : (
            <div className="grid grid-3">
              {featuredPlaces.map((place) => (
                <div key={place._id} className="place-card">
                  <Link to={`/places/${place._id}`}>
                    <img 
                      src={place.primaryImage || '/images/placeholder.jpg'} 
                      alt={place.name}
                      className="place-card-image"
                    />
                    <div className="place-card-content">
                      <h3 className="place-card-title">{place.name}</h3>
                      <p className="place-card-description">{place.shortDescription}</p>
                      <div className="place-card-meta">
                        <span className="place-card-location">
                          <FaMapMarkerAlt /> {place.location.district}
                        </span>
                        <div className="place-card-rating">
                          <FaStar className="rating-stars" />
                          <span>{place.rating.average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/places" className="btn btn-primary">
              View All Places <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="section upcoming-festivals">
        <div className="container">
          <h2 className="section-title">Upcoming Festivals</h2>
          <p className="section-subtitle">
            Experience the vibrant culture and traditions of Telangana
          </p>
          
          {festivalsLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading upcoming festivals...</span>
            </div>
          ) : (
            <div className="grid grid-3">
              {upcomingFestivals.map((festival) => (
                <div key={festival._id} className="festival-card">
                  <Link to={`/festivals/${festival._id}`}>
                    <img 
                      src={festival.primaryImage || '/images/placeholder.jpg'} 
                      alt={festival.name}
                      className="festival-card-image"
                    />
                    <div className="festival-card-content">
                      <h3 className="festival-card-title">{festival.name}</h3>
                      <p className="festival-card-description">{festival.shortDescription}</p>
                      <div className="festival-card-meta">
                        <span className="festival-card-date">
                          <FaCalendarAlt /> {new Date(festival.date.start).toLocaleDateString()}
                        </span>
                        <span className="festival-card-location">
                          <FaMapMarkerAlt /> {festival.location.district}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/festivals" className="btn btn-primary">
              View All Festivals <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Telangana?</h2>
            <p>Start your journey today and discover the hidden gems of this beautiful state.</p>
            <div className="cta-buttons">
              <Link to="/places" className="btn btn-primary">
                Explore Places
              </Link>
              <Link to="/festivals" className="btn btn-secondary">
                View Festivals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
