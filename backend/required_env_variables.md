# Required Environment Variables for CryptoConnect Backend

## Supabase Database Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

## JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here (min 32 characters)
JWT_EXPIRE=7d (or your preferred expiration time)

## Blockchain RPC URLs (Optional but recommended)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-infura-project-id
BSC_RPC_URL=https://bsc-dataseed.binance.org/
POLYGON_RPC_URL=https://polygon-rpc.com/

## Exchange APIs (Optional)
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
COINGECKO_API_KEY=your-coingecko-api-key

## Email Service (Optional - for password reset functionality)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Your App Name <your-email@gmail.com>
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000

## Security
ENCRYPTION_KEY=your-32-character-encryption-key

## Server Configuration
PORT=5000
NODE_ENV=development

## How to Get Supabase Credentials:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" for SUPABASE_URL
4. Copy the "service_role" key (not anon key) for SUPABASE_SERVICE_KEY
5. Make sure to keep these credentials secure

## Important Notes:
- The SUPABASE_SERVICE_KEY should be a service role key, not an anon key
- JWT_SECRET should be a strong, random string (min 32 characters)
- For production, use different credentials and set NODE_ENV=production
