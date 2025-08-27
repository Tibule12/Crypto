# CryptoConnect Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CryptoConnect
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to root directory
cd ..
```

### 3. Set Up Supabase Database

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and service key
3. Run the database schema:
   ```bash
   # Connect to your Supabase database and run the schema from database-schema.sql
   # Or use the Supabase SQL editor to execute the schema
   ```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Database
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Blockchain
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-infura-project-id
BSC_RPC_URL=https://bsc-dataseed.binance.org/
POLYGON_RPC_URL=https://polygon-rpc.com/

# Exchange APIs (optional)
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
COINGECKO_API_KEY=your-coingecko-api-key

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 5. Start the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:

# Backend only
cd backend && npm run dev

# Frontend only (in new terminal)
cd frontend && npm start
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Features Implemented

### ✅ Backend API
- User authentication (register/login)
- Wallet management (create, view balances)
- Trading platform (place orders, order book)
- Market data endpoints
- Security middleware (JWT, rate limiting, CORS)

### ✅ Frontend React App
- User registration and login
- Dashboard with portfolio overview
- Wallet management interface
- Trading platform with order placement
- Market data visualization
- Responsive design

### ✅ Database (Supabase PostgreSQL)
- Users table with authentication
- Wallets table for cryptocurrency storage
- Orders table for trading
- Transactions table for audit trail
- Market data cache table

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation
- Secure headers with Helmet

## Next Steps for Production

1. **Set up proper environment variables** for production
2. **Configure SSL certificates** for HTTPS
3. **Set up monitoring and logging**
4. **Implement proper error handling**
5. **Add comprehensive testing**
6. **Set up CI/CD pipeline**
7. **Configure proper database backups**
8. **Implement rate limiting policies**
9. **Add two-factor authentication**
10. **Set up email notifications**

## Development Roadmap

### Phase 1: Core Platform (Current)
- ✅ User authentication
- ✅ Basic wallet functionality
- ✅ Trading interface
- ✅ Market data display

### Phase 2: Advanced Features
- Real-time price updates
- Advanced order types (stop-loss, take-profit)
- Portfolio analytics
- Mobile app development
- Multi-language support

### Phase 3: Enterprise Features
- API key management
- Institutional trading tools
- Advanced security features
- Compliance and reporting
- White-label solutions

## Troubleshooting

### Common Issues:

1. **Port already in use**: Change PORT in .env file
2. **Database connection issues**: Verify Supabase credentials
3. **CORS errors**: Check backend CORS configuration
4. **JWT errors**: Verify JWT_SECRET in .env

### Getting Help:

Check the console logs for detailed error messages. Most issues can be resolved by verifying environment variables and dependencies.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
