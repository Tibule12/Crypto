import React from 'react';
import './Features.css';

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

const Features = () => {
  return (
    <div className="features-container">
      <h1>Explore Our Features</h1>
      <div className="features-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-details">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
