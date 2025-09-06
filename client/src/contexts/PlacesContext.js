import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const PlacesContext = createContext();

const initialState = {
  places: [],
  featuredPlaces: [],
  currentPlace: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  },
  filters: {
    category: '',
    district: '',
    search: '',
    featured: false
  }
};

const placesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_PLACES':
      return {
        ...state,
        places: action.payload.places,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_FEATURED_PLACES':
      return {
        ...state,
        featuredPlaces: action.payload,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_PLACE':
      return {
        ...state,
        currentPlace: action.payload,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          category: '',
          district: '',
          search: '',
          featured: false
        }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const PlacesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(placesReducer, initialState);

  const fetchPlaces = async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = new URLSearchParams({
        ...state.filters,
        ...params
      }).toString();
      
      const response = await axios.get(`/api/places?${queryParams}`);
      dispatch({
        type: 'SET_PLACES',
        payload: {
          places: response.data.places,
          pagination: response.data.pagination
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch places'
      });
    }
  };

  const fetchFeaturedPlaces = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get('/api/places?featured=true&limit=6');
      dispatch({
        type: 'SET_FEATURED_PLACES',
        payload: response.data.places
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch featured places'
      });
    }
  };

  const fetchPlaceById = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(`/api/places/${id}`);
      dispatch({
        type: 'SET_CURRENT_PLACE',
        payload: response.data.place
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch place'
      });
    }
  };

  const fetchNearbyPlaces = async (lat, lng, radius = 50) => {
    try {
      const response = await axios.get(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data.places;
    } catch (error) {
      console.error('Failed to fetch nearby places:', error);
      return [];
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Load featured places on mount
  useEffect(() => {
    fetchFeaturedPlaces();
  }, []);

  const value = {
    ...state,
    fetchPlaces,
    fetchFeaturedPlaces,
    fetchPlaceById,
    fetchNearbyPlaces,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
