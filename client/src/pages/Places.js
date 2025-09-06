import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePlaces } from '../contexts/PlacesContext';
import { FaMapMarkerAlt, FaStar, FaFilter, FaSearch, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Places.css';

const Places = () => {
  const { places, loading, error, pagination, filters, fetchPlaces, setFilters, clearFilters } = usePlaces();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    district: searchParams.get('district') || '',
    featured: searchParams.get('featured') === 'true'
  });

  const categories = [
    'Historical', 'Religious', 'Natural', 'Cultural', 'Adventure', 'Wildlife', 'Architecture'
  ];

  const districts = [
    'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Mahbubnagar',
    'Nalgonda', 'Adilabad', 'Medak', 'Rangareddy', 'Sangareddy', 'Vikarabad'
  ];

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      ...localFilters
    };
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === false) {
        delete params[key];
      }
    });

    fetchPlaces(params);
  }, [searchParams, localFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.keys(newFilters).forEach(filterKey => {
      if (newFilters[filterKey] && newFilters[filterKey] !== '') {
        newSearchParams.set(filterKey, newFilters[filterKey]);
      }
    });
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', localFilters.search);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      district: '',
      featured: false
    });
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage);
    setSearchParams(newSearchParams);
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const current = pagination.current;
    const total = pagination.pages;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1}
        className="pagination-btn"
      >
        <FaArrowLeft />
      </button>
    );

    // Page numbers
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${current === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(current + 1)}
        disabled={current === total}
        className="pagination-btn"
      >
        <FaArrowRight />
      </button>
    );

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  };

  if (error) {
    return (
      <div className="places-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Error Loading Places</h2>
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="places-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Places to Visit in Telangana</h1>
          <p>Discover amazing destinations across the beautiful state of Telangana</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search places..."
                value={localFilters.search}
                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">District</label>
                <select
                  value={localFilters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <input
                    type="checkbox"
                    checked={localFilters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="filter-checkbox"
                  />
                  Featured Only
                </label>
              </div>

              <div className="filter-actions">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-outline"
                >
                  <FaTimes />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing {places.length} of {pagination.total} places
            {localFilters.search && ` for "${localFilters.search}"`}
            {localFilters.category && ` in ${localFilters.category}`}
            {localFilters.district && ` in ${localFilters.district}`}
          </p>
        </div>

        {/* Places Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading places...</span>
          </div>
        ) : places.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No places found</h3>
            <p>Try adjusting your search criteria or browse all places.</p>
            <button onClick={clearAllFilters} className="btn btn-primary">
              View All Places
            </button>
          </div>
        ) : (
          <>
            <div className="places-grid">
              {places.map((place) => (
                <div key={place._id} className="place-card">
                  <Link to={`/places/${place._id}`}>
                    <div className="place-image-container">
                      <img
                        src={place.primaryImage || '/images/placeholder.jpg'}
                        alt={place.name}
                        className="place-image"
                      />
                      {place.featured && (
                        <div className="featured-badge">Featured</div>
                      )}
                    </div>
                    <div className="place-content">
                      <h3 className="place-title">{place.name}</h3>
                      <p className="place-description">{place.shortDescription}</p>
                      <div className="place-meta">
                        <div className="place-location">
                          <FaMapMarkerAlt />
                          <span>{place.location.district}</span>
                        </div>
                        <div className="place-category">{place.category}</div>
                      </div>
                      <div className="place-rating">
                        <FaStar className="rating-star" />
                        <span>{place.rating.average.toFixed(1)}</span>
                        <span className="rating-count">({place.rating.count} reviews)</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Places;
