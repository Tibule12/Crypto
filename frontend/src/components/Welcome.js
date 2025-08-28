import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const features = [
  {
    title: 'Real-Time Market Data',
    description: 'Stay updated with live prices and market trends.',
    icon: '📈',
  },
  {
    title: 'Secure Wallet',
    description: 'Your assets are protected with top-tier security.',
    icon: '🔒',
  },
  {
    title: 'Advanced Trading Tools',
    description: 'Make informed decisions with our powerful tools.',
    icon: '⚙️',
  },
  {
    title: '24/7 Support',
    description: 'We are here to help you anytime, anywhere.',
    icon: '💬',
  },
];

const testimonials = [
  {
    quote: "CryptoConnect has transformed my trading experience. The platform is intuitive and the fees are unbeatable!",
    author: "Alex Johnson, Crypto Trader",
  },
  {
    quote: "I love the security features and the 24/7 support. It's the best platform I've used!",
    author: "Sarah Williams, Investor",
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleExploreFeatures = () => {
    // Navigate to a public features preview page or show modal (for now, navigate to /features)
    navigate('/features');
  };

  return (
    <div className="welcome-hero">
      <div className="background-animation">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
      </div>
      <div className="welcome-content">
        <h1 className="welcome-title">Discover the Future of Crypto Trading</h1>
        <p className="welcome-subtitle">
          Experience innovation, security, and speed like never before.
        </p>
        <div className="welcome-buttons">
          <button className="btn primary-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>
      <div className="welcome-features-preview">
        <h2>Key Features</h2>
        <div className="features-list">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-info">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="welcome-testimonials">
        <h2>What Our Users Say</h2>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <p>"{testimonial.quote}"</p>
            <div className="testimonial-author">- {testimonial.author}</div>
          </div>
        ))}
      </div>
      <div className="welcome-storytelling">
        <h2>Why Choose Us?</h2>
        <p>
          We combine cutting-edge technology with user-centric design to bring you a platform that is not only powerful but also intuitive and beautiful.
        </p>
        <ul>
          <li>Innovative trading tools</li>
          <li>Robust security measures</li>
          <li>Lightning-fast transactions</li>
          <li>24/7 dedicated support</li>
        </ul>
      </div>
    </div>
  );
};

export default Welcome;
