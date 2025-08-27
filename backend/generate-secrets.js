// Script to generate secure secrets for your .env file
const crypto = require('crypto');

// Generate a secure random JWT secret (32+ characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT_SECRET:', jwtSecret);

// Generate a secure encryption key (32 characters)
const encryptionKey = crypto.randomBytes(16).toString('hex');
console.log('Generated ENCRYPTION_KEY:', encryptionKey);

console.log('\n📋 Copy these values to your .env file:');
console.log('JWT_SECRET=' + jwtSecret);
console.log('ENCRYPTION_KEY=' + encryptionKey);
