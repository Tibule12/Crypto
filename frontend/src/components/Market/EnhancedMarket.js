import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedCharts from '../Charts/AdvancedCharts';
import TransactionHistory from '../Transaction/TransactionHistory';
import './EnhancedMarket.css';

const EnhancedMarket = () => {
  const [prices, setPrices] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMarketData();
    fetchPriceHistory();
    const interval = setInterval(fetchMarketData, 30000);

    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/market/prices');
      setPrices(response.data.prices || []);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/market/${selectedCrypto}/history?days=7`);
      setPriceHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  };

  const filteredPrices = prices.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topGainers = prices
    .filter(crypto => crypto.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const topLosers = prices
    .filter(crypto => crypto.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="market-container">
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
    <div className="market-container">
      <div className="container">
        {/* Header Section */}
        <div className="market-header">
          <div className="header-content">
            <h1 className="gradient-text">Market Overview</h1>
            <p className="header-subtitle">Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-container">
            <div className="search-box">
              <i className="search-icon">🔍</i>
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              Charts
            </button>
            <button
              className={`tab ${activeTab === 'gainers' ? 'active' : ''}`}
              onClick={() => setActiveTab('gainers')}
            >
              Top Movers
            </button>
            <button
              className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>
        </div>

        {/* Market Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${(1.8e12).toLocaleString()}</div>
              <div className="stat-label">Total Market Cap</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">${(85e9).toLocaleString()}</div>
              <div className="stat-label">24h Volume</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">47.2%</div>
              <div className="stat-label">BTC Dominance</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-content">
              <div className="stat-value">65</div>
              <div className="stat-label">Fear & Greed Index</div>
            </div>
          </div>
        </div>

        {/* Prices Table */}
        {activeTab === 'overview' && (
          <div className="market-card">
            <div className="card-header">
              <h3>Cryptocurrency Prices</h3>
              <span className="total-count">{filteredPrices.length} coins</span>
            </div>
            <div className="prices-table">
              <div className="table-header">
                <span>Name</span>
                <span>Price</span>
                <span>24h Change</span>
                <span>Market Cap</span>
                <span>Volume (24h)</span>
              </div>
              {filteredPrices.map((crypto) => (
                <div key={crypto.id} className="table-row">
                  <span className="crypto-name">
                    <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                    {crypto.name}
                  </span>
                  <span className="price">${crypto.current_price.toLocaleString()}</span>
                  <span className={`change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'} {Math.abs(crypto.price_change_percentage_24h)}%
                  </span>
                  <span className="market-cap">${crypto.market_cap.toLocaleString()}</span>
                  <span className="volume">${crypto.volume_24h.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Charts */}
        {activeTab === 'charts' && (
          <div className="market-card">
            <AdvancedCharts priceData={priceHistory} />
          </div>
        )}

        {/* Top Gainers & Losers */}
        {activeTab === 'gainers' && (
          <div className="gainers-losers-grid">
            <div className="market-card">
              <div className="card-header">
                <h3>Top Gainers ↗</h3>
              </div>
              <div className="movers-list">
                {topGainers.map((crypto) => (
                  <div key={crypto.id} className="mover-item positive">
                    <span className="mover-name">{crypto.symbol.toUpperCase()}</span>
                    <span className="mover-price">${crypto.current_price.toLocaleString()}</span>
                    <span className="mover-change">+{crypto.price_change_percentage_24h}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="market-card">
              <div className="card-header">
                <h3>Top Losers ↘</h3>
              </div>
              <div className="movers-list">
                {topLosers.map((crypto) => (
                  <div key={crypto.id} className="mover-item negative">
                    <span className="mover-name">{crypto.symbol.toUpperCase()}</span>
                    <span className="mover-price">${crypto.current_price.toLocaleString()}</span>
                    <span className="mover-change">{crypto.price_change_percentage_24h}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {activeTab === 'transactions' && (
          <TransactionHistory />
        )}
      </div>
    </div>
  );
};

export default EnhancedMarket;
