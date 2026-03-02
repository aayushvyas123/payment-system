# Payment System

NestJS payment system with wallet management and withdrawal processing.

## Requirements

- Node.js 18+
- MongoDB (replica set)
- Redis

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB replica set

```bash
mongod --replSet rs0 --dbpath /path/to/data
mongosh --eval "rs.initiate()"
```

### 3. Start Redis

```bash
redis-server
```

### 4. Environment variables

Create `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/payment-system?replicaSet=rs0
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Run the app

```bash
npm run start:dev
```

## API Endpoints

### Auth
- `POST /auth/login` - Login with email/password

### Users
- `POST /users/register` - Register new user
- `GET /users/me` - Get current user (requires auth)

### Wallets
- `POST /wallets/deposit` - Deposit money (requires auth)
- `GET /wallets/balance` - Get balance (requires auth)

### Withdrawals
- `POST /withdrawals` - Create withdrawal (requires auth)
- `GET /withdrawals/:id` - Get withdrawal by ID (requires auth)

## Example Usage

```bash
# Register
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Deposit (use token from login)
curl -X POST http://localhost:3000/wallets/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount":100}'

# Check balance
curl -X GET http://localhost:3000/wallets/balance \
  -H "Authorization: Bearer <token>"

# Create withdrawal
curl -X POST http://localhost:3000/withdrawals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount":25,"destination":"bank123","idempotencyKey":"unique-key"}'
```