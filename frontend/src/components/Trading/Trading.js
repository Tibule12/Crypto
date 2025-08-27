import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TradingContainer = styled.div`
  .trading-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 30px;
  }

  .order-item {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .type {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .type.buy {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .type.sell {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .status.pending {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  .status.filled {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .status.cancelled {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .order-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
  }

  .detail {
    display: flex;
    flex-direction: column;
  }

  .label {
    color: #888;
    font-size: 12px;
  }

  .value {
    color: #fff;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .trading-layout {
      grid-template-columns: 1fr;
    }
  }
`;

const Trading = () => {
  const [orderType, setOrderType] = useState('LIMIT');
  const [tradeType, setTradeType] = useState('BUY');
  const [pair, setPair] = useState('BTC/USDT');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trade/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        type: tradeType,
        pair,
        amount: parseFloat(amount),
        orderType,
        price: orderType === 'LIMIT' ? parseFloat(price) : null
      };

      const response = await axios.post('http://localhost:5000/api/trade/orders', orderData);
      
      if (response.data.message === 'Order created successfully') {
        alert('Order placed successfully!');
        setAmount('');
        setPrice('');
        fetchOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/trade/orders/${orderId}/cancel`);
      alert('Order cancelled successfully!');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <TradingContainer>
      <div className="container">
      <div className="trading-header">
        <h1>Trading Platform</h1>
      </div>

      <div className="trading-layout">
        <div className="order-form-section">
          <div className="card">
            <h3>Place Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="form-input"
                >
                  <option value="LIMIT">Limit Order</option>
                  <option value="MARKET">Market Order</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trade Type</label>
                <select
                  value={tradeType}
                  onChange={(e) => setTradeType(e.target.value)}
                  className="form-input"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trading Pair</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="form-input"
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="BNB/USDT">BNB/USDT</option>
                  <option value="ETH/BTC">ETH/BTC</option>
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

              {orderType === 'LIMIT' && (
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="orders-section">
          <div className="card">
            <h3>Your Orders</h3>
            {orders.length === 0 ? (
              <p>No orders yet. Place your first order to get started!</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className={`type ${order.type.toLowerCase()}`}>
                        {order.type}
                      </span>
                      <span className="pair">{order.pair}</span>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <div className="detail">
                        <span className="label">Amount:</span>
                        <span className="value">{order.amount}</span>
                      </div>
                      
                      {order.price && (
                        <div className="detail">
                          <span className="label">Price:</span>
                          <span className="value">${order.price}</span>
                        </div>
                      )}
                      
                      <div className="detail">
                        <span className="label">Order Type:</span>
                        <span className="value">{order.order_type}</span>
                      </div>
                    </div>

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="btn btn-secondary"
                        style={{ marginTop: '10px' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      </div>
    </TradingContainer>
  );
};

export default Trading;
