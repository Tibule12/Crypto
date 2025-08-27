const http = require('http');

// Configuration
const BASE_URL = 'localhost:5000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: parsedData
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testWalletCreation() {
    try {
        console.log('Testing wallet creation endpoint...');
        
        // Step 1: Log in with the existing test user
        console.log('\n1. Logging in test user...');
        const loginData = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        };
        
        const loginResponse = await makeRequest('POST', '/auth/login', loginData);
        
        if (loginResponse.status !== 200) {
            console.log('❌ Login failed:', loginResponse.data);
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log('Token:', token);
        console.log('User ID:', loginResponse.data.user.id);
        
        // Step 2: Test wallet creation
        console.log('\n2. Testing ETH wallet creation...');
        
        const walletData = {
            currency: 'ETH'
        };
        
        const walletResponse = await makeRequest('POST', '/wallet/create', walletData, {
            'Authorization': `Bearer ${token}`
        });
        
        if (walletResponse.status === 201) {
            console.log('✅ ETH wallet created successfully:');
            console.log('Wallet Address:', walletResponse.data.wallet.address);
            console.log('Balance:', walletResponse.data.wallet.balance);
        } else {
            console.log('❌ Error creating ETH wallet:');
            console.log('Status:', walletResponse.status);
            console.log('Error:', walletResponse.data.error);
        }
        
        // Step 3: Get user wallets
        console.log('\n3. Getting user wallets...');
        
        const walletsResponse = await makeRequest('GET', '/wallet', null, {
            'Authorization': `Bearer ${token}`
        });
        
        if (walletsResponse.status === 200) {
            console.log('✅ Wallets retrieved successfully:');
            console.log('Number of wallets:', walletsResponse.data.wallets.length);
            walletsResponse.data.wallets.forEach(wallet => {
                console.log(`- ${wallet.currency}: ${wallet.address} (Balance: ${wallet.balance})`);
            });
        } else {
            console.log('❌ Error getting wallets:');
            console.log('Status:', walletsResponse.status);
            console.log('Error:', walletsResponse.data.error);
        }
        
    } catch (error) {
        console.log('❌ Test failed:');
        console.log('Error:', error.message);
    }
}

// Run the test
testWalletCreation();
