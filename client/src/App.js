import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlacesProvider } from './contexts/PlacesContext';
import { FestivalsProvider } from './contexts/FestivalsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import Festivals from './pages/Festivals';
import FestivalDetail from './pages/FestivalDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PlacesProvider>
        <FestivalsProvider>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/places" element={<Places />} />
                <Route path="/places/:id" element={<PlaceDetail />} />
                <Route path="/festivals" element={<Festivals />} />
                <Route path="/festivals/:id" element={<FestivalDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </FestivalsProvider>
      </PlacesProvider>
    </AuthProvider>
  );
}

export default App;
