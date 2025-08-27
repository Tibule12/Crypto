const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';
const TEST_FIRST_NAME = 'Test';
const TEST_LAST_NAME = 'User';

async function testWalletCreation() {
    try {
        console.log('Testing wallet creation endpoint...');
        
        // Step 1: Register a test user
        console.log('\n1. Registering test user...');
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            firstName: TEST_FIRST_NAME,
            lastName: TEST_LAST_NAME
        });
        
        const token = registerResponse.data.token;
        console.log('✅ Registration successful');
        console.log('Token:', token);
        console.log('User ID:', registerResponse.data.user.id);
        
        // Step 2: Test wallet creation with different currencies
        console.log('\n2. Testing wallet creation...');
        
        const currencies = ['BTC', 'ETH', 'USDT', 'BNB'];
        
        for (const currency of currencies) {
            console.log(`\nCreating ${currency} wallet...`);
            
            try {
                const walletResponse = await axios.post(`${BASE_URL}/wallet/create`, {
                    currency: currency
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`✅ ${currency} wallet created successfully:`);
                console.log('Wallet Address:', walletResponse.data.wallet.address);
                console.log('Balance:', walletResponse.data.wallet.balance);
                
            } catch (walletError) {
                console.log(`❌ Error creating ${currency} wallet:`);
                if (walletError.response) {
                    console.log('Status:', walletError.response.status);
                    console.log('Error:', walletError.response.data.error);
                } else {
                    console.log('Error:', walletError.message);
                }
            }
        }
        
        // Step 3: Get user wallets
        console.log('\n3. Getting user wallets...');
        
        try {
            const walletsResponse = await axios.get(`${BASE_URL}/wallet`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ Wallets retrieved successfully:');
            console.log('Number of wallets:', walletsResponse.data.wallets.length);
            walletsResponse.data.wallets.forEach(wallet => {
                console.log(`- ${wallet.currency}: ${wallet.address} (Balance: ${wallet.balance})`);
            });
            
        } catch (walletsError) {
            console.log('❌ Error getting wallets:');
            if (walletsError.response) {
                console.log('Status:', walletsError.response.status);
                console.log('Error:', walletsError.response.data.error);
            } else {
                console.log('Error:', walletsError.message);
            }
        }
        
    } catch (error) {
        console.log('❌ Test failed:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data.error);
            console.log('Response data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

// Run the test
testWalletCreation();
