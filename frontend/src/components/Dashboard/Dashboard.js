import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Market from '../Market/Market'; // Import the Market component
import TransferFunds from '../Transfer/TransferFunds'; // Import the TransferFunds component

const Dashboard = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const portfolioResponse = await axios.get('http://localhost:5000/api/wallet');
      setPortfolio(portfolioResponse.data.wallets || []);

      const marketResponse = await axios.get('http://localhost:5000/api/market/prices');
      setMarketData(marketResponse.data.prices || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPortfolioValue = () => {
    return portfolio.reduce((total, wallet) => {
      const marketPrice = marketData.find(m => m.symbol === wallet.currency.toLowerCase())?.current_price || 0;
      return total + (wallet.balance * marketPrice);
    }, 0);
  };

  const handleBuyCrypto = () => {
    navigate('/trading');
  };

  const handleSellCrypto = () => {
    navigate('/trading');
  };

  const handleTransferFunds = () => {
    // Logic for transferring funds (e.g., open a modal or redirect)
    alert('Transfer Funds functionality to be implemented.');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="portfolio-summary">
          <h2>Portfolio Value: ${getTotalPortfolioValue().toLocaleString()}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Your Portfolio</h3>
          {portfolio.length === 0 ? (
            <p>No wallets yet. Create your first wallet to get started!</p>
          ) : (
            <div className="portfolio-list">
              {portfolio.map((wallet) => {
                const marketInfo = marketData.find(m => m.symbol === wallet.currency.toLowerCase());
                const value = wallet.balance * (marketInfo?.current_price || 0);
                
                return (
                  <div key={wallet.id} className="portfolio-item">
                    <div className="currency-info">
                      <span className="currency-symbol">{wallet.currency}</span>
                      <span className="wallet-address">{wallet.address.substring(0, 8)}...</span>
                    </div>
                    <div className="balance-info">
                      <span className="balance">{wallet.balance} {wallet.currency}</span>
                      <span className="value">${value.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Market /> {/* Render the Market component here */}
        <TransferFunds /> {/* Render the TransferFunds component here */}

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={handleBuyCrypto}>Buy Crypto</button>
            <button className="btn btn-secondary" onClick={handleSellCrypto}>Sell Crypto</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>No recent activity yet. Start trading to see your activity here!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
