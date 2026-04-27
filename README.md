# FoodApp — Zomato-like Multi-Restaurant Food Delivery Platform

A full-stack MERN application built on top of a simple pizza ordering app, transformed into a complete food delivery platform similar to Zomato/Swiggy.

---

## Quick Start (One Command)

```bash
git clone https://github.com/keshav23456/foodie.git
cd foodie
npm run setup
```

That's it. The script will:
1. Check Node.js and MongoDB are available
2. Create `.env` from defaults
3. Install all backend and frontend dependencies
4. Fix macOS quarantine permissions (if applicable)
5. Seed the database with 103 restaurants and menu items
6. Start both backend (port 5500) and frontend (port 3000)

Once running, open **http://localhost:3000** in your browser.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | v16+ | [nodejs.org](https://nodejs.org) |
| MongoDB | v5+ | Must be running on port 27017 |
| npm | v7+ | Comes with Node.js |

**Install MongoDB on Mac (if not already installed):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```
The setup script starts it automatically.

---

## Manual Setup (Alternative)

If you prefer running steps individually:

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Set up environment
cp .env.example .env   # edit values if needed

# 3. Start MongoDB
brew services start mongodb-community@7.0

# 4. Seed the database
npm run seed

# 5. Start backend (terminal 1)
npm start

# 6. Start frontend (terminal 2)
cd client && npm start
```

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | password123 |
| Restaurant Owner (Pizza) | owner@test.com | password123 |
| Restaurant Owner (Burger) | burger@test.com | password123 |
| Restaurant Owner (Biryani) | biryani@test.com | password123 |
| Admin | admin@test.com | admin123 |

---

## Environment Variables (`.env`)

```env
PORT=5500
MONGO_URI=mongodb://127.0.0.1:27017/foodapp
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
CLIENT_URL=http://localhost:3000
```

---

## App URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main app |
| http://localhost:3000/restaurants | Browse all restaurants |
| http://localhost:3000/cart | Shopping cart |
| http://localhost:3000/orders | My orders (login required) |
| http://localhost:3000/profile | User profile (login required) |
| http://localhost:3000/dashboard | Owner dashboard (owner role) |
| http://localhost:3000/admin | Admin panel (admin role) |
| http://localhost:5500 | Backend API |

---

## Project Structure

```
mern-pizza/
├── setup.sh                  # One-command setup script
├── seed.js                   # DB seeder (103 restaurants)
├── server.js                 # Express entry point
├── .env                      # Environment variables
├── .env.example              # Template for .env
│
├── config/
│   └── db.js                 # MongoDB connection
│
├── middleware/
│   ├── auth.js               # JWT verify middleware
│   ├── roleCheck.js          # Role-based access control
│   └── errorHandler.js       # Global error handler
│
├── models/
│   ├── userModel.js          # User (customer/owner/admin)
│   ├── restaurantModel.js    # Restaurant
│   ├── menuItemModel.js      # Menu items
│   ├── orderModels.js        # Orders
│   └── reviewModel.js        # Reviews
│
├── controllers/
│   ├── authController.js     # Register, login, profile
│   ├── restaurantController.js
│   ├── menuController.js
│   ├── orderController.js    # Stripe checkout + order tracking
│   ├── reviewController.js
│   └── adminController.js
│
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   ├── restaurantRoutes.js   # /api/restaurants/*
│   ├── menuRoutes.js         # /api/menu/*
│   ├── orderRoutes.js        # /api/orders/*
│   ├── reviewRoutes.js       # /api/reviews/*
│   └── adminRoutes.js        # /api/admin/*
│
├── utils/
│   ├── asyncHandler.js       # try/catch wrapper
│   └── generateToken.js      # JWT token generator
│
└── client/                   # React frontend
    └── src/
        ├── redux/slices/
        │   ├── authSlice.js
        │   ├── cartSlice.js
        │   ├── restaurantSlice.js
        │   └── orderSlice.js
        │
        ├── pages/
        │   ├── Home.js
        │   ├── RestaurantList.js
        │   ├── RestaurantDetail.js
        │   ├── Cart.js
        │   ├── Checkout.js
        │   ├── OrderSuccess.js
        │   ├── Orders.js
        │   ├── Profile.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── OwnerDashboard.js
        │   └── AdminPanel.js
        │
        ├── components/
        │   ├── Navbar.js
        │   ├── ProtectedRoute.js
        │   ├── OrderTracker.js
        │   └── StarRating.js
        │
        ├── hooks/
        │   └── useAuth.js
        │
        └── utils/
            └── axiosConfig.js   # Axios with Bearer token interceptor
```

---

## API Reference

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | Yes | Get current user |
| PUT | `/profile` | Yes | Update name/phone/password |
| POST | `/address` | Yes | Add delivery address |
| DELETE | `/address/:id` | Yes | Delete address |

### Restaurants (`/api/restaurants`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List all (supports `?search=`, `?cuisine=`, `?sort=rating\|deliveryTime`, `?veg=true`, `?minRating=`) |
| GET | `/:id` | No | Restaurant details |
| GET | `/:id/menu` | No | Available menu items |
| POST | `/` | Owner | Create restaurant |
| PUT | `/:id` | Owner | Update restaurant |
| GET | `/mine` | Owner | Get your restaurant |

### Menu (`/api/menu`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Owner | Add menu item |
| PUT | `/:itemId` | Owner | Update item |
| DELETE | `/:itemId` | Owner | Delete item |
| PATCH | `/:itemId/toggle` | Owner | Toggle availability |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/checkout_session` | Yes | Create Stripe session |
| POST | `/verify-payment` | Yes | Verify payment after Stripe redirect |
| GET | `/my` | Yes | My orders |
| GET | `/restaurant/:id` | Owner | Orders for restaurant |
| PATCH | `/:id/status` | Owner | Update order status |

### Reviews (`/api/reviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Post review (delivered orders only) |
| GET | `/restaurant/:id` | No | Get restaurant reviews |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/restaurants/pending` | Admin | Pending approvals |
| PATCH | `/restaurants/:id/approve` | Admin | Approve/reject |
| GET | `/users` | Admin | All users |
| GET | `/orders` | Admin | All orders |

---

## What Was Built

This app was transformed from a basic single-restaurant pizza ordering app into a full multi-restaurant platform. Here's everything that changed:

### Backend — Fixed & Added
| What | Before | After |
|------|--------|-------|
| Passwords | Plain text in MongoDB | bcrypt hashed (10 rounds) |
| Authentication | None (returned user object) | JWT tokens (7-day expiry) |
| Route protection | No middleware | `protect` + `roleCheck` middleware |
| Error handling | `try/catch` in every route | `asyncHandler` + global `errorHandler` |
| CORS | Missing | `cors` middleware for `localhost:3000` |
| Config | Hardcoded URLs and keys | `.env` via `dotenv` |
| Stripe | Old deprecated `charges.create` API | New `checkout.sessions.create` API |
| DB connection | Buggy (`module.export` typo) | `connectDB()` with proper error handling |
| Models | 3 basic models, no validation | 5 models with refs, roles, enums |
| Routes | 3 route files | 6 route files + 5 controller files |

### Frontend — Fixed & Added
| What | Before | After |
|------|--------|-------|
| Redux | Old `createStore` + manual thunks | Redux Toolkit (`configureStore` + slices) |
| Auth state | `localStorage` user object | JWT token + `authSlice` with `loadUser` |
| API calls | Raw `axios` | Axios instance with Bearer token interceptor |
| BrowserRouter | Placed inside App (Navbar broke routing) | Moved to `index.js` wrapping everything |
| Cart | Single-store cart | Multi-restaurant cart with conflict dialog |
| Pages | 6 basic screens | 12 full pages |
| Components | Basic | Navbar, ProtectedRoute, OrderTracker, StarRating |

### Database — Seeded
- **103 restaurants** across 15+ cuisine types (Pizza, Burgers, Biryani, Chinese, South Indian, North Indian, Seafood, Continental, Street Food, Thai, Japanese, Korean, Desserts, Vegan, BBQ, Breakfast, and more)
- **Menu items** for all restaurants
- **5 users** (customer, 3 owners, admin) with hashed passwords

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React-Bootstrap, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Payments | Stripe Checkout Sessions |
| State | Redux Toolkit (configureStore + createSlice + createAsyncThunk) |
