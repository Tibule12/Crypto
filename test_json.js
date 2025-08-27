// Test script to verify JSON generation
const generateMockHistory = (days) => {
  const history = [];
  const basePrice = 44000;
  const volatility = 0.03;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const price = basePrice * (1 + (Math.random() - 0.5) * volatility * 2);
    const volume = Math.random() * 1000000000 + 500000000;
    
    const entry = {
      timestamp: date.getTime(),
      price: parseFloat(price.toFixed(2)),
      volume: parseFloat(volume.toFixed(2))
    };
    console.log('Generated entry:', entry);
    history.push(entry);
  }
  
  return history;
};

const history = generateMockHistory(7);
console.log('Generated history:', JSON.stringify(history, null, 2));

const testResponse = { symbol: 'btc', history };
console.log('Test response:', JSON.stringify(testResponse, null, 2));
