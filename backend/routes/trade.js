const express = require('express');
const { connectDB } = require('../config/database');

const router = express.Router();

// Initialize database connection
let db = null;
let isMockMode = false;

// Initialize database connection on startup
(async () => {
  db = await connectDB();
  isMockMode = db.mock === true;
})();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = db
      .from('orders')
      .select('*')
      .eq('user_id', req.userId);

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { type, pair, amount, price, orderType } = req.body;

    // Validate inputs
    if (!['BUY', 'SELL'].includes(type) || !['LIMIT', 'MARKET'].includes(orderType)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    if (!pair || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid order details' });
    }

    if (orderType === 'LIMIT' && (!price || price <= 0)) {
      return res.status(400).json({ error: 'Price required for limit orders' });
    }

    // Check if user has sufficient balance for sell orders
    if (type === 'SELL') {
      const [baseCurrency] = pair.split('/');
      
    const { data: wallet, error: walletError } = await db
      .from('wallets')
      .select('balance')
      .eq('user_id', req.userId)
      .eq('currency', baseCurrency)
      .single();

    if (walletError || !wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    }

    // Create order
    const { data: newOrder, error } = await db
      .from('orders')
      .insert([
        {
          user_id: req.userId,
          type,
          pair,
          amount,
          price: orderType === 'LIMIT' ? price : null,
          order_type: orderType,
          status: 'PENDING',
          created_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // In production, this would trigger order matching logic
    // For demo, we'll simulate immediate execution for market orders
    if (orderType === 'MARKET') {
      // Simulate order execution
      setTimeout(async () => {
        const { error: updateError } = await db
          .from('orders')
          .update({ status: 'FILLED', filled_at: new Date() })
          .eq('id', newOrder.id);

        if (updateError) {
          console.error('Order execution error:', updateError);
        }
      }, 2000);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel order
router.post('/orders/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', req.userId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Cannot cancel order in current state' });
    }

    const { error: updateError } = await db
      .from('orders')
      .update({ status: 'CANCELLED', cancelled_at: new Date() })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order book for a pair
router.get('/orderbook/:pair', async (req, res) => {
  try {
    const { pair } = req.params;

    const { data: buyOrders, error: buyError } = await db
      .from('orders')
      .select('*')
      .eq('pair', pair)
      .eq('type', 'BUY')
      .eq('status', 'PENDING')
      .order('price', { ascending: false });

    const { data: sellOrders, error: sellError } = await db
      .from('orders')
      .select('*')
      .eq('pair', pair)
      .eq('type', 'SELL')
      .eq('status', 'PENDING')
      .order('price', { ascending: true });

    if (buyError || sellError) {
      throw buyError || sellError;
    }

    res.json({
      pair,
      bids: buyOrders,
      asks: sellOrders
    });
  } catch (error) {
    console.error('Get orderbook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
