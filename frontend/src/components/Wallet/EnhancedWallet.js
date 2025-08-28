import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './EnhancedWallet.css';

const EnhancedWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [expandedAsset, setExpandedAsset] = useState(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet data
      const walletResponse = await axios.get('http://localhost:5000/api/wallet', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Fetch market data
      const marketResponse = await axios.get('http://localhost:5000/api/market/prices');
      
      setWallet(walletResponse.data.wallets || []);
      setMarketData(marketResponse.data.prices || []);
      
      // Fetch transactions after wallet data is loaded
      fetchTransactions();
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wallet/transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Mock data for demonstration - in production, this would come from market data
  const mockMarketData = {
    BTC: { name: 'Bitcoin', currentPrice: 45000, priceChange: 2.5 },
    ETH: { name: 'Ethereum', currentPrice: 3000, priceChange: -1.2 },
    USDT: { name: 'Tether', currentPrice: 1, priceChange: 0.1 },
    BNB: { name: 'Binance Coin', currentPrice: 350, priceChange: 3.1 }
  };

  // Combine wallet data with market data
  const portfolioWithMarketData = wallet.map(walletItem => {
    // Try to find market data for this currency
    const marketItem = marketData.find(m => m.symbol.toLowerCase() === walletItem.currency.toLowerCase());
    
    return {
      ...walletItem,
      symbol: walletItem.currency,
      name: marketItem?.name || mockMarketData[walletItem.currency]?.name || walletItem.currency,
      currentPrice: marketItem?.current_price || mockMarketData[walletItem.currency]?.currentPrice || 0,
      priceChange: marketItem?.price_change_percentage_24h || mockMarketData[walletItem.currency]?.priceChange || 0
    };
  });

  // Calculate total balance safely
  const totalBalance = portfolioWithMarketData.reduce((total, asset) => {
    const assetValue = (asset.balance || 0) * (asset.currentPrice || 0);
    return total + (isNaN(assetValue) ? 0 : assetValue);
  }, 0);

  if (loading) {
    return (
      <div className="wallet-container">
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
    <div className="wallet-container">
      <div className="container">
        {/* Header Section */}
        <div className="wallet-header">
          <div className="header-content">
            <h1 className="gradient-text">My Wallet</h1>
            <p className="header-subtitle">Manage your cryptocurrency assets</p>
          </div>
          <div className="wallet-stats">
            <div className="total-balance">
              <span className="balance-label">Total Balance</span>
              <span className="balance-value">${totalBalance.toLocaleString()}</span>
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
              className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button
              className={`tab ${activeTab === 'receive' ? 'active' : ''}`}
              onClick={() => setActiveTab('receive')}
            >
              Receive
            </button>
            <button
              className={`tab ${activeTab === 'send' ? 'active' : ''}`}
              onClick={() => setActiveTab('send')}
            >
              Send
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="wallet-content">
            <div className="assets-section">
              <div className="section-header">
                <h2>Your Assets</h2>
                <span className="section-badge">{portfolioWithMarketData.length} assets</span>
              </div>

              {portfolioWithMarketData.length > 0 ? (
                <div className="assets-grid">
                  {portfolioWithMarketData.map((asset) => (
                    <div 
                      key={asset.symbol} 
                      className="asset-card"
                      onClick={() => setExpandedAsset(expandedAsset === asset.symbol ? null : asset.symbol)}
                      style={{ cursor: 'pointer' }}
                    >
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
                        <div className="detail-row">
                          <span className="detail-label">Balance</span>
                          <span className="detail-value">{asset.balance.toFixed(6)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Current Price</span>
                          <span className="detail-value">${(asset.currentPrice || 0).toLocaleString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Value</span>
                          <span className="detail-value">
                            ${((asset.balance || 0) * (asset.currentPrice || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {expandedAsset === asset.symbol && (
                        <div className="asset-expanded-details">
                          <div className="detail-row">
                            <span className="detail-label">24h Change</span>
                            <span className={`detail-value ${asset.priceChange >= 0 ? 'positive' : 'negative'}`}>
                              {asset.priceChange >= 0 ? '+' : ''}{asset.priceChange.toFixed(2)}%
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Asset ID</span>
                            <span className="detail-value">{asset.id || 'N/A'}</span>
                          </div>
                        </div>
                      )}

                      <div className="asset-actions">
                        <button className="btn btn-secondary btn-sm">Send</button>
                        <button className="btn btn-primary btn-sm">Receive</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-wallet">
                  <div className="empty-icon">💼</div>
                  <h3>Your wallet is empty</h3>
                  <p>Start by purchasing some cryptocurrencies</p>
                  <button className="btn btn-primary">Buy Crypto</button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-value">{portfolioWithMarketData.length}</div>
                    <div className="stat-label">Total Assets</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {portfolioWithMarketData.filter(a => a.priceChange > 0).length}
                    </div>
                    <div className="stat-label">Assets Up</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {portfolioWithMarketData.filter(a => a.priceChange < 0).length}
                    </div>
                    <div className="stat-label">Assets Down</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.length}
                    </div>
                    <div className="stat-label">Total Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <div className="section-header">
              <h2>Transaction History</h2>
              <span className="section-badge">{transactions.length} transactions</span>
            </div>

            {transactions.length > 0 ? (
              <div className="transactions-table">
                <div className="table-header">
                  <span>Type</span>
                  <span>Asset</span>
                  <span>Amount</span>
                  <span>Value</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="table-row">
                    <span className={`type ${transaction.type}`}>
                      {transaction.type ? transaction.type.toUpperCase() : 'N/A'}
                    </span>
                    <span className="asset">{transaction.symbol ? transaction.symbol.toUpperCase() : 'N/A'}</span>
                    <span className="amount">{transaction.amount || '0.00'}</span>
                    <span className="value">${transaction.value ? transaction.value.toLocaleString() : '0.00'}</span>
                    <span className="date">
                      {transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className={`status ${transaction.status || 'pending'}`}>
                      {transaction.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-transactions">
                <div className="empty-icon">📋</div>
                <h3>No transactions yet</h3>
                <p>Your transaction history will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Receive Tab */}
        {activeTab === 'receive' && (
          <div className="receive-section">
            <div className="section-header">
              <h2>Receive Crypto</h2>
            </div>
            
            <div className="receive-card">
              <div className="qr-code">
                <div className="qr-placeholder">
                  <span className="qr-text">QR Code</span>
                  <span className="qr-subtext">Scan to receive</span>
                </div>
              </div>
              
              <div className="address-section">
                <div className="form-group">
                  <label className="form-label">Your Wallet Address</label>
                  <div className="address-input">
                    <input
                      type="text"
                      value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      readOnly
                      className="form-input"
                    />
                    <button className="btn btn-secondary btn-sm">Copy</button>
                  </div>
                </div>
                
                <div className="warning-note">
                  <div className="warning-icon">⚠️</div>
                  <p>
                    Only send {selectedCrypto || 'Bitcoin (BTC)'} to this address. 
                    Sending other cryptocurrencies may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="send-section">
            <div className="section-header">
              <h2>Send Crypto</h2>
            </div>
            
            <div className="send-card">
              <div className="form-group">
                <label className="form-label">Select Asset</label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="form-input"
                >
                  <option value="">Choose cryptocurrency</option>
                  {portfolioWithMarketData.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.name} ({asset.symbol ? asset.symbol.toUpperCase() : 'N/A'}) - Balance: {asset.balance.toFixed(6)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Recipient Address</label>
                <input
                  type="text"
                  placeholder="Enter wallet address"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              
              <div className="send-actions">
                <button className="btn btn-primary">Review Transaction</button>
                <button className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWallet;
