import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: '30d'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Sample transaction data for demonstration
  const sampleTransactions = [
    {
      id: 1,
      type: 'buy',
      crypto: 'BTC',
      amount: 0.5,
      price: 45000,
      total: 22500,
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      txHash: '0x1234567890abcdef'
    },
    {
      id: 2,
      type: 'sell',
      crypto: 'ETH',
      amount: 2.5,
      price: 2800,
      total: 7000,
      status: 'completed',
      date: '2024-01-14T15:45:00Z',
      txHash: '0xabcdef1234567890'
    },
    {
      id: 3,
      type: 'buy',
      crypto: 'SOL',
      amount: 10,
      price: 95,
      total: 950,
      status: 'pending',
      date: '2024-01-13T09:15:00Z',
      txHash: '0x7890abcdef123456'
    },
    {
      id: 4,
      type: 'sell',
      crypto: 'ADA',
      amount: 500,
      price: 0.45,
      total: 225,
      status: 'completed',
      date: '2024-01-12T16:20:00Z',
      txHash: '0x4567890abcdef123'
    },
    {
      id: 5,
      type: 'buy',
      crypto: 'DOT',
      amount: 15,
      price: 6.8,
      total: 102,
      status: 'failed',
      date: '2024-01-11T11:05:00Z',
      txHash: '0xdef1234567890abc'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch transactions
    const fetchTransactions = async () => {
      try {
        // In a real application, you would fetch from an API
        // const response = await axios.get('/api/transactions');
        // setTransactions(response.data);
        
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filters, searchQuery, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.crypto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Crypto', 'Amount', 'Price', 'Total', 'Status', 'Transaction Hash'];
    const csvData = filteredTransactions.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      tx.type.toUpperCase(),
      tx.crypto,
      tx.amount,
      `$${tx.price.toLocaleString()}`,
      `$${tx.total.toLocaleString()}`,
      tx.status,
      tx.txHash
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transaction-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        <div className="header-actions">
          <button onClick={exportToCSV} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by crypto or transaction hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="transactions-table">
        <div className="table-header">
          <span>Date & Time</span>
          <span>Type</span>
          <span>Crypto</span>
          <span>Amount</span>
          <span>Price</span>
          <span>Total</span>
          <span>Status</span>
          <span>Transaction Hash</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            No transactions found matching your filters.
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="table-row">
              <span className="date">{formatDate(transaction.date)}</span>
              <span className={`type ${transaction.type}`}>
                {transaction.type.toUpperCase()}
              </span>
              <span className="crypto">{transaction.crypto}</span>
              <span className="amount">{transaction.amount}</span>
              <span className="price">${transaction.price.toLocaleString()}</span>
              <span className="total">${transaction.total.toLocaleString()}</span>
              <span className={`status ${transaction.status}`}>
                {transaction.status}
              </span>
              <span className="tx-hash" title={transaction.txHash}>
                {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-6)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="transaction-stats">
        <div className="stat">
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{filteredTransactions.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Volume</span>
          <span className="stat-value">
            ${filteredTransactions.reduce((sum, tx) => sum + tx.total, 0).toLocaleString()}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed</span>
          <span className="stat-value">
            {filteredTransactions.filter(tx => tx.status === 'completed').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
