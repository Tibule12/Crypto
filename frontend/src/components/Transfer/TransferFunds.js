import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransferFunds = () => {
  const [wallets, setWallets] = useState([]);
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wallet');
      setWallets(response.data.wallets || []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/wallet/transfer', {
        fromWallet,
        toWallet,
        amount: parseFloat(amount)
      });

      if (response.data.message === 'Transfer successful') {
        setMessage('Transfer completed successfully!');
        setFromWallet('');
        setToWallet('');
        setAmount('');
        fetchWallets(); // Refresh wallets to update balances
      }
    } catch (error) {
      console.error('Failed to transfer funds:', error);
      setMessage('Transfer failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-funds">
      <h3>Transfer Funds</h3>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label className="form-label">From Wallet</label>
          <select
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select source wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.currency} - Balance: {wallet.balance}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">To Wallet</label>
          <select
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select destination wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.currency} - Balance: {wallet.balance}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Transferring...' : 'Transfer Funds'}
        </button>

        {message && (
          <div className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default TransferFunds;
