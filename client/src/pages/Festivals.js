import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFestivals } from '../contexts/FestivalsContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaSearch, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Festivals.css';

const Festivals = () => {
  const { festivals, loading, error, pagination, filters, fetchFestivals, setFilters, clearFilters } = useFestivals();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    district: searchParams.get('district') || '',
    upcoming: searchParams.get('upcoming') === 'true',
    featured: searchParams.get('featured') === 'true'
  });

  const categories = [
    'Religious', 'Cultural', 'Harvest', 'Seasonal', 'Traditional', 'Modern'
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

    fetchFestivals(params);
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
      upcoming: false,
      featured: false
    });
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage);
    setSearchParams(newSearchParams);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (festival) => {
    return new Date(festival.date.start) > new Date();
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
      <div className="festivals-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Error Loading Festivals</h2>
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
    <div className="festivals-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Festivals of Telangana</h1>
          <p>Experience the vibrant culture and rich traditions through these amazing festivals</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search festivals..."
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
                    checked={localFilters.upcoming}
                    onChange={(e) => handleFilterChange('upcoming', e.target.checked)}
                    className="filter-checkbox"
                  />
                  Upcoming Only
                </label>
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
            Showing {festivals.length} of {pagination.total} festivals
            {localFilters.search && ` for "${localFilters.search}"`}
            {localFilters.category && ` in ${localFilters.category}`}
            {localFilters.district && ` in ${localFilters.district}`}
          </p>
        </div>

        {/* Festivals Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading festivals...</span>
          </div>
        ) : festivals.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🎭</div>
            <h3>No festivals found</h3>
            <p>Try adjusting your search criteria or browse all festivals.</p>
            <button onClick={clearAllFilters} className="btn btn-primary">
              View All Festivals
            </button>
          </div>
        ) : (
          <>
            <div className="festivals-grid">
              {festivals.map((festival) => (
                <div key={festival._id} className="festival-card">
                  <Link to={`/festivals/${festival._id}`}>
                    <div className="festival-image-container">
                      <img
                        src={festival.primaryImage || '/images/placeholder.jpg'}
                        alt={festival.name}
                        className="festival-image"
                      />
                      {festival.featured && (
                        <div className="featured-badge">Featured</div>
                      )}
                      {isUpcoming(festival) && (
                        <div className="upcoming-badge">Upcoming</div>
                      )}
                    </div>
                    <div className="festival-content">
                      <h3 className="festival-title">{festival.name}</h3>
                      <p className="festival-description">{festival.shortDescription}</p>
                      <div className="festival-meta">
                        <div className="festival-date">
                          <FaCalendarAlt />
                          <span>{formatDate(festival.date.start)}</span>
                        </div>
                        <div className="festival-location">
                          <FaMapMarkerAlt />
                          <span>{festival.location.district}</span>
                        </div>
                      </div>
                      <div className="festival-category">{festival.category}</div>
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

export default Festivals;
