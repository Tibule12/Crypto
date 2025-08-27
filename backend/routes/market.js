const express = require('express');
const axios = require('axios');
const { supabase } = require('../config/database');

const router = express.Router();

// Get market data for all supported cryptocurrencies
router.get('/prices', async (req, res) => {
  try {
    const mockPrices = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000,
        price_change_24h: 1200,
        price_change_percentage_24h: 2.74,
        market_cap: 850000000000,
        volume_24h: 25000000000
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3200,
        price_change_24h: -150,
        price_change_percentage_24h: -4.48,
        market_cap: 380000000000,
        volume_24h: 18000000000
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'Binance Coin',
        current_price: 350,
        price_change_24h: 8.5,
        price_change_percentage_24h: 2.49,
        market_cap: 55000000000,
        volume_24h: 1200000000
      },
      {
        id: 'tether',
        symbol: 'usdt',
        name: 'Tether',
        current_price: 1.00,
        price_change_24h: 0.00,
        price_change_percentage_24h: 0.00,
        market_cap: 83000000000,
        volume_24h: 45000000000
      }
    ];

    res.json({ prices: mockPrices });
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get price history for a specific cryptocurrency
router.get('/:symbol/history', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = '7' } = req.query;

const generateMockHistory = (days) => {
  const history = [];
  const basePrice = symbol === 'btc' ? 44000 : 
                   symbol === 'eth' ? 3100 :
                   symbol === 'bnb' ? 340 : 1;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const priceChange = (Math.random() - 0.5) * 1000; // Simulate price change
    const price = Math.max(0, basePrice + priceChange); // Ensure price doesn't go negative

    const entry = { 
      timestamp: date.getTime(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.random() * 1000000000 + 500000000
    };
    history.push(entry);
  }

  return history; // Ensure this is returned correctly
    };

    const history = generateMockHistory(parseInt(days));
    console.log('Generated history:', JSON.stringify(history, null, 2));
    res.setHeader('Content-Type', 'application/json');
    res.json({ symbol, history });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trading pairs
router.get('/pairs', async (req, res) => {
  try {
    const pairs = [
      'BTC/USDT',
      'ETH/USDT',
      'BNB/USDT',
      'ETH/BTC',
      'BNB/BTC'
    ];

    res.json({ pairs });
  } catch (error) {
    console.error('Get pairs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get 24h market statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total_volume: 85000000000,
      total_market_cap: 1800000000000,
      active_traders: 1250000,
      daily_transactions: 2850000,
      btc_dominance: 47.2,
      fear_greed_index: 65 // 0-100 scale
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search cryptocurrencies
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const allCryptos = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
      { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin' },
      { id: 'tether', symbol: 'usdt', name: 'Tether' },
      { id: 'cardano', symbol: 'ada', name: 'Cardano' },
      { id: 'solana', symbol: 'sol', name: 'Solana' },
      { id: 'ripple', symbol: 'xrp', name: 'XRP' },
      { id: 'polkadot', symbol: 'dot', name: 'Polkadot' }
    ];

    const results = allCryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(query.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
