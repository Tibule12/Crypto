import React, { useState } from 'react';
import './PriceAlerts.css';

const PriceAlerts = ({ marketData }) => {
  const [alertPrice, setAlertPrice] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [alerts, setAlerts] = useState([]);

  const handleSetAlert = () => {
    if (!selectedCrypto || !alertPrice) {
      alert('Please select a cryptocurrency and enter an alert price');
      return;
    }

    const newAlert = {
      id: Date.now(),
      crypto: selectedCrypto,
      price: parseFloat(alertPrice),
      createdAt: new Date().toISOString(),
      triggered: false
    };
    
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    setAlertPrice('');
    setSelectedCrypto('');
    
    console.log(`Alert set for ${selectedCrypto} at $${alertPrice}`);
  };

  const removeAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="price-alerts">
      <div className="alert-form">
        <h3>Create New Alert</h3>
        <select 
          value={selectedCrypto} 
          onChange={(e) => setSelectedCrypto(e.target.value)}
          className="alert-select"
        >
          <option value="">Select Cryptocurrency</option>
          {marketData.map((crypto) => (
            <option key={crypto.id} value={crypto.symbol}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Alert Price ($)"
          value={alertPrice}
          onChange={(e) => setAlertPrice(e.target.value)}
          className="alert-input"
        />
        <button onClick={handleSetAlert} className="alert-button">
          Set Alert
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="active-alerts">
          <h3>Active Alerts</h3>
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <span className="alert-crypto">{alert.crypto.toUpperCase()}</span>
              <span className="alert-price">${alert.price.toLocaleString()}</span>
              <button 
                onClick={() => removeAlert(alert.id)}
                className="alert-remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
