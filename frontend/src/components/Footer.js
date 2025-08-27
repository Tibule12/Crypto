import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CryptoConnect</h3>
          <p>Your secure platform for buying, selling, and trading cryptocurrencies with advanced tools and robust security.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/wallet">Wallet</Link></li>
            <li><Link to="/trading">Trading</Link></li>
            <li><Link to="/market">Market</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <ul className="footer-links">
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#telegram">Telegram</a></li>
            <li><a href="#discord">Discord</a></li>
            <li><a href="#github">GitHub</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 CryptoConnect. All rights reserved. Built with cutting-edge blockchain technology.</p>
      </div>
    </footer>
  );
};

export default Footer;
