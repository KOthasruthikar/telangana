import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const FestivalsContext = createContext();

const initialState = {
  festivals: [],
  upcomingFestivals: [],
  currentFestival: null,
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
    upcoming: false,
    featured: false
  }
};

const festivalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_FESTIVALS':
      return {
        ...state,
        festivals: action.payload.festivals,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_UPCOMING_FESTIVALS':
      return {
        ...state,
        upcomingFestivals: action.payload,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_FESTIVAL':
      return {
        ...state,
        currentFestival: action.payload,
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
          upcoming: false,
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

export const FestivalsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(festivalsReducer, initialState);

  const fetchFestivals = async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = new URLSearchParams({
        ...state.filters,
        ...params
      }).toString();
      
      const response = await axios.get(`/api/festivals?${queryParams}`);
      dispatch({
        type: 'SET_FESTIVALS',
        payload: {
          festivals: response.data.festivals,
          pagination: response.data.pagination
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch festivals'
      });
    }
  };

  const fetchUpcomingFestivals = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get('/api/festivals/upcoming?limit=6');
      dispatch({
        type: 'SET_UPCOMING_FESTIVALS',
        payload: response.data.festivals
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch upcoming festivals'
      });
    }
  };

  const fetchFestivalById = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(`/api/festivals/${id}`);
      dispatch({
        type: 'SET_CURRENT_FESTIVAL',
        payload: response.data.festival
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch festival'
      });
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

  // Load upcoming festivals on mount
  useEffect(() => {
    fetchUpcomingFestivals();
  }, []);

  const value = {
    ...state,
    fetchFestivals,
    fetchUpcomingFestivals,
    fetchFestivalById,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <FestivalsContext.Provider value={value}>
      {children}
    </FestivalsContext.Provider>
  );
};

export const useFestivals = () => {
  const context = useContext(FestivalsContext);
  if (!context) {
    throw new Error('useFestivals must be used within a FestivalsProvider');
  }
  return context;
};
