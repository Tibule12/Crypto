import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const MarketContainer = styled.div`
  .market-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .market-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
  }

  .prices-table {
    margin-top: 15px;
  }

  .table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    padding: 15px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .positive {
    color: #4caf50;
  }

  .negative {
    color: #f44336;
  }

  .chart-controls {
    margin-bottom: 20px;
  }

  .chart-container {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 20px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .current-price {
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
  }

  .chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 200px;
    padding: 20px 0;
  }

  .chart-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .bar {
    width: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
    min-height: 1px;
  }

  .bar-label {
    font-size: 10px;
    color: #888;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .stat-label {
    display: block;
    color: #888;
    font-size: 12px;
    margin-bottom: 5px;
  }

  .stat-value {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .gainers-losers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .section h4 {
    margin-bottom: 10px;
    color: #667eea;
  }

  .crypto-change {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    margin-bottom: 5px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    .market-header {
      flex-direction: column;
      gap: 15px;
      align-items: stretch;
    }

    .search-box input {
      width: 100% !important;
    }

    .market-grid {
      grid-template-columns: 1fr;
    }

    .table-header,
    .table-row {
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }

    .gainers-losers {
      grid-template-columns: 1fr;
    }
  }
`;

const Market = () => {
  const [prices, setPrices] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMarketData();
    fetchPriceHistory();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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
      console.log('Price history response:', response.data);
      setPriceHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  };

  const filteredPrices = prices.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <MarketContainer>
        <div className="container">
          <div className="spinner"></div>
        </div>
      </MarketContainer>
    );
  }

  return (
    <MarketContainer>
      <div className="container">
      <div className="market-header">
        <h1>Market Overview</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <div className="market-grid">
        <div className="market-card">
          <h3>Cryptocurrency Prices</h3>
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
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </span>
                <span className="price">${crypto.current_price.toLocaleString()}</span>
                <span className={`change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h)}%
                </span>
                <span className="market-cap">${crypto.market_cap.toLocaleString()}</span>
                <span className="volume">${crypto.volume_24h.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="market-card">
          <h3>Price Chart</h3>
          <div className="chart-controls">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="form-input"
            >
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
              <option value="bnb">Binance Coin (BNB)</option>
              <option value="usdt">Tether (USDT)</option>
            </select>
          </div>
          
          <div className="price-chart">
            {priceHistory.length > 0 ? (
              <div className="chart-container">
                <div className="chart-header">
                  <h4>{selectedCrypto.toUpperCase()} Price (7 days)</h4>
                  <span className="current-price">
                    ${priceHistory[priceHistory.length - 1]?.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="chart">
                  {/* Simple text-based chart representation */}
                  <div className="chart-bars">
                    {priceHistory.slice(-10).map((point, index) => {
                      console.log('Chart point:', point);
                      const maxPrice = Math.max(...priceHistory.map(p => p.price));
                      const minPrice = Math.min(...priceHistory.map(p => p.price));
                      // Prevent division by zero
                      const height = maxPrice === minPrice ? 50 : ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                      
                      return (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar" 
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="bar-label">
                            ${point.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
        </div>

        <div className="market-card">
          <h3>Market Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Market Cap</span>
              <span className="stat-value">$1.8T</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">24h Volume</span>
              <span className="stat-value">$85B</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">BTC Dominance</span>
              <span className="stat-value">47.2%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fear & Greed Index</span>
              <span className="stat-value">65 (Greed)</span>
            </div>
          </div>
        </div>

        <div className="market-card">
          <h3>Top Gainers & Losers</h3>
          <div className="gainers-losers">
            <div className="section">
              <h4>Top Gainers ↑</h4>
              {prices
                .filter(crypto => crypto.price_change_percentage_24h > 0)
                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                .slice(0, 3)
                .map((crypto) => (
                  <div key={crypto.id} className="crypto-change positive">
                    <span>{crypto.symbol.toUpperCase()}</span>
                    <span>+{crypto.price_change_percentage_24h}%</span>
                  </div>
                ))}
            </div>
            
            <div className="section">
              <h4>Top Losers ↓</h4>
              {prices
                .filter(crypto => crypto.price_change_percentage_24h < 0)
                .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                .slice(0, 3)
                .map((crypto) => (
                  <div key={crypto.id} className="crypto-change negative">
                    <span>{crypto.symbol.toUpperCase()}</span>
                    <span>{crypto.price_change_percentage_24h}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      </div>
    </MarketContainer>
  );
};

export default Market;
