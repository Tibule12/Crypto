import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const basename = process.env.REACT_APP_BASENAME || '/Crypto';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginComponent from './components/Auth/Login';
import RegisterComponent from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Wallet from './components/Wallet/Wallet';
import Trading from './components/Trading/Trading';
import Market from './components/Market/Market';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Welcome from './components/Welcome';
import Features from './components/Features';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import './App.css';
import './styles/Enhanced.css';
import './styles/EnhancedApp.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h1 className="gradient-text">CryptoConnect</h1>
          <p>Your gateway to the crypto world</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginComponent /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterComponent /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/forgot-password" 
            element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/reset-password" 
            element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wallet" 
            element={user ? <Wallet /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/trading" 
            element={user ? <Trading /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/market" 
            element={user ? <Market /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Welcome />} 
          />
          <Route 
            path="/welcome" 
            element={<Welcome />} 
          />
          <Route 
            path="/features" 
            element={<Features />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
<Router basename={basename}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Adding a comment to trigger deployment
export default App;
