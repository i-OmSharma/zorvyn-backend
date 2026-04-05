# Finance Backend API

A backend system for a finance dashboard with role-based access control,<br> Zorvyn FinTech assignment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v22 |
| Framework | Express.js v5 |
| Language | TypeScript |
| Database | PostgreSQL 17 (Docker) |
| ORM | Prisma v5 |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Zod |
| Password Hashing | bcryptjs |

---

## Architecture

Modular layered architecture — each feature is a self-contained module following:
```
Route → Controller → Service → Repository → Database
```

```
src/
├── config/          # Env vars, Prisma client
├── middlewares/     # Auth, Role guard, Error handler
├── modules/
│   ├── auth/        # Register, Login, Refresh, Logout
│   ├── users/       # User management (Admin only)
│   ├── transactions/ # Financial records CRUD
│   └── dashboard/   # Summary, Trends, Categories
└── utils/           # ApiError, ApiResponse, asyncHandler
```
---

## Setup & Installation

### Prerequisites
- Node.js v18+
- Docker

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/i-OmSharma/zorvyn-backend
cd finance-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://finance_user:fin_pass@localhost:5433/finance_db"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=3d
BCRYPT_ROUNDS=12
```

**4. Start PostgreSQL with Docker**
```bash
docker compose up -d
```

**5. Run database migrations**
```bash
npm run db:migrate
```

**6. Start the server**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Roles & Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View trends & categories | ❌ | ✅ | ✅ |
| Create transactions | ❌ | ✅ | ✅ |
| Update transactions | ❌ | ✅ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Endpoints

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login
POST   /api/auth/refresh      Refresh access token
POST   /api/auth/logout       Logout
```
### Users (Admin only)
```
GET    /api/users             Get all users
GET    /api/users/:id         Get user by ID
PATCH  /api/users/:id/role    Update user role
PATCH  /api/users/:id/status  Update user status
DELETE /api/users/:id         Delete user
```
### Transactions
```
POST   /api/transactions      Create transaction (Admin/Analyst)
GET    /api/transactions      Get all transactions (All roles)
GET    /api/transactions/:id  Get transaction by ID (All roles)
PATCH  /api/transactions/:id  Update transaction (Admin/Analyst)
DELETE /api/transactions/:id  Delete transaction (Admin only)
```
#### Query Filters for GET /api/transactions
```
?type=INCOME|EXPENSE
?category=Salary
?startDate=2026-01-01
?endDate=2026-04-30
?page=1
?limit=10
```
### Dashboard
```
GET    /api/dashboard/summary     Summary (All roles)
GET    /api/dashboard/categories  Category totals (Analyst/Admin)
GET    /api/dashboard/trends      Monthly trends (Analyst/Admin)
```
---

## Data Models

### User
```
id, name, email, password, role, status, createdAt, updatedAt
```
### Transaction
```
id, amount, type, category, date, notes, isDeleted, createdById, createdAt, updatedAt
```
### RefreshToken
```
id, token, userId, expiresAt, createdAt
```
---

## Key Design Decisions

**Refresh token rotation** — Every refresh issues a new token pair and invalidates the old one. Logout deletes the token from DB.

**Soft delete** — Transactions are never hard deleted. `isDeleted: true` hides them from all queries while preserving data integrity.

**Env validation at startup** — All environment variables are validated with Zod when the server starts. Missing vars cause immediate exit with a clear error.

**Repository layer** — All DB queries are isolated in repository files. Services contain only business logic and never touch Prisma directly.

**Pagination** — All transaction listing endpoints are paginated with configurable page and limit.

---

## Assumptions

- First registered user is VIEWER by default. Role must be updated manually or by an Admin.
- Soft deleted transactions are excluded from all queries and dashboard calculations.
- Refresh tokens expire in 3 days. Access tokens expire in 15 minutes.
- Amount is stored as `Decimal(12,2)` to avoid floating point issues with financial data.

---

## Author

Om Sharma 