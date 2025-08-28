const express = require('express');
const { ethers } = require('ethers');
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

// Get user wallets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: wallets, error } = await db
      .from('wallets')
      .select('*')
      .eq('user_id', req.userId);

    if (error) {
      throw error;
    }

    res.json({ wallets });
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new wallet
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { currency } = req.body;
    
    if (!['BTC', 'ETH', 'USDT', 'BNB'].includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    // Generate wallet (for demo purposes - in production, use proper key management)
    let walletAddress, privateKey;
    
    if (currency === 'ETH' || currency === 'USDT' || currency === 'BNB') {
      const wallet = ethers.Wallet.createRandom();
      walletAddress = wallet.address;
      privateKey = wallet.privateKey;
    } else if (currency === 'BTC') {
      // For BTC, we'd use a different library in production
      walletAddress = 'bc1q' + Math.random().toString(36).substring(2, 22);
      privateKey = 'xprv' + Math.random().toString(36).substring(2, 66);
    }

    if (isMockMode) {
      // Mock wallet creation for demo purposes
      const mockWallet = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: req.userId,
        currency,
        address: walletAddress,
        private_key: privateKey,
        balance: 0,
        created_at: new Date()
      };

      return res.status(201).json({
        message: 'Wallet created successfully (mock mode)',
        wallet: {
          id: mockWallet.id,
          currency: mockWallet.currency,
          address: mockWallet.address,
          balance: mockWallet.balance
        }
      });
    }

    // Save wallet to database
    const { data: newWallet, error } = await db
      .from('wallets')
      .insert([
        {
          user_id: req.userId,
          currency,
          address: walletAddress,
          private_key: privateKey, // In production, this should be encrypted
          balance: 0,
          created_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: 'Wallet created successfully',
      wallet: {
        id: newWallet.id,
        currency: newWallet.currency,
        address: newWallet.address,
        balance: newWallet.balance
      }
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wallet balance
router.get('/:walletId/balance', authenticateToken, async (req, res) => {
  try {
    const { walletId } = req.params;

    if (isMockMode) {
      // Mock wallet balance for demo purposes
      const mockWallet = {
        id: walletId,
        balance: Math.random() * 10, // Random balance between 0-10
        currency: 'ETH' // Default currency for mock
      };
      
      return res.json({ balance: mockWallet.balance, currency: mockWallet.currency });
    }

    const { data: wallet, error } = await db
      .from('wallets')
      .select('*')
      .eq('id', walletId)
      .eq('user_id', req.userId)
      .single();

    if (error || !wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // In production, this would fetch actual blockchain balance
    // For demo, we'll return the stored balance
    res.json({ balance: wallet.balance, currency: wallet.currency });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send transaction
router.post('/:walletId/send', authenticateToken, async (req, res) => {
  try {
    const { walletId } = req.params;
    const { toAddress, amount } = req.body;

    // Validate inputs
    if (!toAddress || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transaction details' });
    }

    if (isMockMode) {
      // Mock transaction for demo purposes
      return res.json({ message: 'Transaction sent successfully (mock mode)' });
    }

    const { data: wallet, error: walletError } = await db
      .from('wallets')
      .select('*')
      .eq('id', walletId)
      .eq('user_id', req.userId)
      .single();

    if (walletError || !wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // In production, this would create an actual blockchain transaction
    // For demo, we'll simulate the transaction

    // Update sender balance
    const { error: updateError } = await db
      .from('wallets')
      .update({ balance: wallet.balance - amount })
      .eq('id', walletId);

    if (updateError) {
      throw updateError;
    }

    // Record transaction
    const { error: txError } = await db
      .from('transactions')
      .insert([
        {
          user_id: req.userId,
          wallet_id: walletId,
          type: 'SEND',
          amount,
          currency: wallet.currency,
          from_address: wallet.address,
          to_address: toAddress,
          status: 'COMPLETED',
          created_at: new Date()
        }
      ]);

    if (txError) {
      throw txError;
    }

    res.json({ message: 'Transaction sent successfully' });
  } catch (error) {
    console.error('Send transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    if (isMockMode) {
      // Mock transactions for demo purposes
      const mockTransactions = [
        {
          id: 'tx1',
          type: 'RECEIVE',
          symbol: 'ETH',
          amount: 1.5,
          value: 4500,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: 'COMPLETED'
        },
        {
          id: 'tx2',
          type: 'SEND',
          symbol: 'BTC',
          amount: 0.1,
          value: 4000,
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          status: 'COMPLETED'
        },
        {
          id: 'tx3',
          type: 'RECEIVE',
          symbol: 'USDT',
          amount: 100,
          value: 100,
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          status: 'COMPLETED'
        }
      ];
      
      return res.json({ transactions: mockTransactions });
    }

    const { data: transactions, error } = await db
      .from('transactions')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format transactions for frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      symbol: tx.currency,
      amount: tx.amount,
      value: tx.amount * 100, // Mock value calculation
      timestamp: tx.created_at,
      status: tx.status
    }));

    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
