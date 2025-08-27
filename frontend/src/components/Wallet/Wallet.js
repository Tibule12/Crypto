import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const WalletContainer = styled.div`
  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .wallet-actions {
    display: flex;
    align-items: center;
  }

  .wallets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .wallet-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .status.active {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .status.inactive {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .wallet-details {
    margin-bottom: 15px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .label {
    color: #888;
    font-size: 14px;
  }

  .value {
    color: #fff;
    font-weight: 600;
  }

  .address {
    font-family: monospace;
    font-size: 12px;
  }

  .balance {
    color: #4caf50;
    font-size: 18px;
  }

  .wallet-actions {
    display: flex;
    gap: 10px;
  }

  .wallet-actions .btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 14px;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #888;
  }
`;

const Wallet = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wallet');
      setWallets(response.data.wallets || []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setCreating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/wallet/create', {
        currency: selectedCurrency
      });
      
      setWallets([...wallets, response.data.wallet]);
      alert('Wallet created successfully!');
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert('Failed to create wallet: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <WalletContainer>
        <div className="container">
          <div className="spinner"></div>
        </div>
      </WalletContainer>
    );
  }

  return (
    <WalletContainer>
      <div className="container">
      <div className="wallet-header">
        <h1>Wallet Management</h1>
        <div className="wallet-actions">
          <select 
            value={selectedCurrency} 
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="form-input"
            style={{ width: 'auto', marginRight: '10px' }}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="BNB">Binance Coin (BNB)</option>
          </select>
          <button 
            onClick={createWallet} 
            className="btn btn-primary"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      </div>

      <div className="wallets-grid">
        {wallets.length === 0 ? (
          <div className="empty-state">
            <h3>No wallets yet</h3>
            <p>Create your first wallet to start managing your cryptocurrencies.</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <div key={wallet.id} className="wallet-card">
              <div className="wallet-header">
                <h3>{wallet.currency} Wallet</h3>
                <span className={`status ${wallet.balance > 0 ? 'active' : 'inactive'}`}>
                  {wallet.balance > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="wallet-details">
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value address">{wallet.address}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Balance:</span>
                  <span className="value balance">
                    {wallet.balance} {wallet.currency}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">
                    {new Date(wallet.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="wallet-actions">
                <button className="btn btn-secondary">Send</button>
                <button className="btn btn-secondary">Receive</button>
                <button className="btn btn-secondary">View Transactions</button>
              </div>
            </div>
          ))
        )}
      </div>

      </div>
    </WalletContainer>
  );
};

export default Wallet;
