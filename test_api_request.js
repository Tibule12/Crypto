import fetch from 'node-fetch';

async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/market/btc/history?days=7');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();
