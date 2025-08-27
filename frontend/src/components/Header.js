import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          CryptoConnect
        </Link>
        
        <nav className="nav">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/wallet" 
                className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
              >
                Wallet
              </Link>
              <Link 
                to="/trading" 
                className={`nav-link ${isActive('/trading') ? 'active' : ''}`}
              >
                Trading
              </Link>
              <Link 
                to="/market" 
                className={`nav-link ${isActive('/market') ? 'active' : ''}`}
              >
                Market
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="user-menu">
            <span className="user-email">{user.email}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
