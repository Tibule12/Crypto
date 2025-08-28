import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import PriceAlerts from '../Alerts/PriceAlerts';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch wallet data
      const walletResponse = await axios.get('http://localhost:5000/api/wallet', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Fetch market data
      const marketResponse = await axios.get('http://localhost:5000/api/market/prices');
      
      setWallet(walletResponse.data.wallets || []);
      setMarketData(marketResponse.data.prices || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration - in production, this would come from market data
  const mockMarketData = {
    BTC: { name: 'Bitcoin', currentPrice: 45000, priceChange: 2.5 },
    ETH: { name: 'Ethereum', currentPrice: 3000, priceChange: -1.2 },
    USDT: { name: 'Tether', currentPrice: 1, priceChange: 0.1 },
    BNB: { name: 'Binance Coin', currentPrice: 350, priceChange: 3.1 }
  };

  const portfolioWithMarketData = wallet.map(walletItem => ({
    ...walletItem,
    symbol: walletItem.currency,
    name: mockMarketData[walletItem.currency]?.name || walletItem.currency,
    currentPrice: mockMarketData[walletItem.currency]?.currentPrice || 0,
    priceChange: mockMarketData[walletItem.currency]?.priceChange || 0
  }));

  const totalPortfolioValue = portfolioWithMarketData.reduce((total, asset) => total + (asset.balance * asset.currentPrice), 0);
  const portfolioChange = portfolioWithMarketData.reduce((total, asset) => total + (asset.balance * asset.priceChange), 0);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="gradient-text">Welcome back, {user?.email}</h1>
            <p className="welcome-subtitle">Your crypto portfolio at a glance</p>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-label">Total Balance</span>
              <span className="stat-value">${totalPortfolioValue.toLocaleString()}</span>
            </div>
            <div className={`quick-stat ${portfolioChange >= 0 ? 'positive' : 'negative'}`}>
              <span className="stat-label">24h Change</span>
              <span className="stat-value">
                {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="portfolio-section">
          <div className="section-header">
            <h2>Portfolio Overview</h2>
            <span className="section-badge">{portfolioWithMarketData.length} assets</span>
          </div>

          {portfolioWithMarketData.length > 0 ? (
            <div className="portfolio-grid">
              {portfolioWithMarketData.map((asset) => (
                <div key={asset.symbol} className="portfolio-card">
                  <div className="asset-header">
                    <div className="asset-info">
                      <span className="asset-symbol">{asset.symbol ? asset.symbol.toUpperCase() : 'N/A'}</span>
                      <span className="asset-name">{asset.name}</span>
                    </div>
                    <div className={`price-change ${asset.priceChange >= 0 ? 'positive' : 'negative'}`}>
                      {asset.priceChange >= 0 ? '↗' : '↘'} {Math.abs(asset.priceChange)}%
                    </div>
                  </div>
                  
                  <div className="asset-details">
                    <div className="detail-item">
                      <span className="detail-label">Balance</span>
                      <span className="detail-value">{asset.balance.toFixed(6)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Price</span>
                      <span className="detail-value">${asset.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Value</span>
                      <span className="detail-value">
                        ${(asset.balance * asset.currentPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-portfolio">
              <div className="empty-icon">💼</div>
              <h3>No assets in portfolio</h3>
              <p>Start building your portfolio by purchasing some cryptocurrencies</p>
            </div>
          )}
        </div>

        {/* Price Alerts */}
        <div className="price-alerts-section">
          <div className="section-header">
            <h2>Price Alerts</h2>
            <span className="section-badge">Real-time</span>
          </div>
          <PriceAlerts marketData={marketData} />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">💰</div>
              <h3>Buy Crypto</h3>
              <p>Purchase cryptocurrencies instantly</p>
              <button className="btn btn-primary">Start Trading</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📤</div>
              <h3>Send Funds</h3>
              <p>Transfer crypto to other users</p>
              <button className="btn btn-secondary">Send Now</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>Market Analysis</h3>
              <p>View detailed market charts</p>
              <button className="btn btn-secondary">View Charts</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Manage your account settings</p>
              <button className="btn btn-secondary">Configure</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
