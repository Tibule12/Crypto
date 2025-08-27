# CryptoConnect Troubleshooting Guide

## Current Issues:
- ✅ Server is running but in mock mode
- ❌ Using anonymous key instead of service role key
- ❌ 500 errors when accessing API endpoints
- ✅ Secure secrets generated successfully

## Step-by-Step Solution:

### 1. Get Your Service Role Key
1. Go to https://app.supabase.com/
2. Select your project "dzvbtghyiuhrntflwwtw"
3. Navigate to Settings > API
4. Find "Service Role" section (NOT "Project API keys")
5. Click "Reveal" and copy the service_role key

### 2. Update Your .env File
Manually edit `backend/.env` with the following values:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Database - USE SERVICE ROLE KEY
SUPABASE_URL=https://dzvbtghyiuhrntflwwtw.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT - Use generated secure secret
JWT_SECRET=c08728983198b58ec6d73a676798b3b132f1c3b317f27cc753c5efecb50b1d65
JWT_EXPIRE=7d

# Encryption key - Use generated secure key
ENCRYPTION_KEY=c9a4cf1148dd4d01ced00a6ccc6f09f2
```

### 3. Apply Database Schema
Make sure you've run the `database-schema.sql` file in your Supabase SQL editor to create the necessary tables.

### 4. Restart the Server
Since port 5000 is already in use, you need to:
1. Stop the currently running server (Ctrl+C in the terminal)
2. Restart it: `cd backend && npm start`

### 5. Verify Connection
After restarting, you should see:
- ✅ "Supabase connected successfully" message
- ✅ No more "Using mock mode" warnings
- ✅ API endpoints should work without 500 errors

## Key Differences:
- **Anonymous Key**: For client-side, limited permissions (what you have now)
- **Service Role Key**: For server-side, full database access (what you need)

## Expected Results:
- Dashboard should load wallet data
- Trading interface should show orders
- No more 500 Internal Server Errors
- Real database operations instead of mock mode

## If Issues Persist:
1. Check Supabase dashboard for database connection issues
2. Verify tables exist (users, wallets, orders, transactions)
3. Check server logs for specific error messages
