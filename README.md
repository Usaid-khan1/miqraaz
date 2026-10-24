# Miqraaz — Full-Stack E-Commerce Platform

A production-oriented, full-stack e-commerce web application built with **React, Node.js, Express, and MongoDB Atlas / Mongoose**.

Preserves the luxury editorial minimalist identity of the brand (monochrome palette, typography with Jost & Urdu script, artisanal aesthetics from Lyari) while delivering database persistence, authentication, server-validated checkout, inventory controls, promotional first-order coupons, customer account oversight, and a dedicated admin dashboard.

---

## 📑 Architecture Overview

- **Frontend**: React 18 (Vite build tool), React Router v6, Context API (Auth, Cart, Toast), Vanilla CSS design system.
- **Backend**: Node.js & Express.js REST API with modular controllers, services, middleware, and models.
- **Database**: MongoDB Atlas using Mongoose ODM with schema validation, indexes, and aggregation pipelines.
- **Security**: JWT authentication, bcrypt password hashing, Role-Based Access Control (RBAC), Helmet security headers, CORS protection, rate-limiting, and server-side monetary recalculation.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18 (Tested on v22)
- MongoDB running locally or a MongoDB Atlas cluster URI

### 2. Environment Setup

#### Backend Environment: `backend/.env`
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local or MongoDB Atlas)
# Local:
MONGODB_URI=mongodb://127.0.0.1:27017/miqraaz
# MongoDB Atlas format:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/miqraaz?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173

# Initial Admin Bootstrap Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@miqraaz.com
ADMIN_PASSWORD=AdminPassword123!
```

#### Frontend Environment: `.env`
Create `.env` in the root folder:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📦 Database Seeding & Admin Bootstrap

Populate the database with initial categories, catalog products, sample coupons, and store settings:
```bash
npm run seed
```

To create or reset an administrator account via CLI:
```bash
npm run bootstrap-admin
# Or with custom credentials:
# node backend/src/scripts/bootstrapAdmin.js admin@custom.com MySecurePass "Admin Name"
```

**Default Test Credentials:**
- **Administrator**: `admin@miqraaz.com` / `AdminPassword123!`
- **Test Customer**: `customer@example.com` / `CustomerPassword123!`

---

## 🏃 Running the Application

### Option A: Run Both Services Concurrently
```bash
npm run dev
```

### Option B: Run Services Separately
Terminal 1 (Backend API on port 5000):
```bash
npm run dev:backend
```

Terminal 2 (Frontend Client on port 5173):
```bash
npm run dev:frontend
```

---

## 🌐 Connecting to MongoDB Atlas

1. Log into your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2. In your Cluster, click **Connect** -> **Drivers (Node.js)**.
3. Copy the connection string format:
   ```
   mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/miqraaz?retryWrites=true&w=majority
   ```
4. Replace `<db_username>` and `<db_password>` with your database user credentials.
5. In **Network Access**, ensure your IP address (or `0.0.0.0/0` for development) is added to the IP Access List.
6. Paste the connection string into `backend/.env` as `MONGODB_URI`.
7. Run `npm run seed` to initialize your Atlas database with the product catalog and categories.

---

## 🛣️ API Endpoints Summary (`/api/v1`)

### Authentication & Profiles (`/auth`)
- `POST /auth/register` — Create customer account.
- `POST /auth/login` — Sign in and receive JWT token.
- `GET /auth/me` — Get authenticated user details & addresses.
- `PUT /auth/profile` — Update name or phone.
- `PUT /auth/password` — Change password.
- `POST /auth/forgot-password` — Generate secure password reset token.
- `POST /auth/reset-password/:token` — Set new password using token.
- `POST /auth/addresses` — Add saved shipping address.
- `PUT /auth/addresses/:id` — Update saved address.
- `DELETE /auth/addresses/:id` — Remove saved address.

### Products (`/products`)
- `GET /products` — Query catalog with filters (`collection`, `minPrice`, `maxPrice`, `inStock`, `outOfStock`, `sort`, `search`, `page`).
- `GET /products/featured` — Get featured catalog products.
- `GET /products/:identifier` — Get product details by slug or ObjectId + related products.
- `POST /products` — [Admin] Create new product with size variant stock.
- `PUT /products/:id` — [Admin] Update product details, price, images, or stock.
- `DELETE /products/:id` — [Admin] Delete product.

### Categories (`/categories`)
- `GET /categories` — Get active categories for navigation and mega menus.
- `GET /categories/:slug` — Get category details.
- `POST /categories` — [Admin] Create category.
- `PUT /categories/:id` — [Admin] Update category.
- `DELETE /categories/:id` — [Admin] Safe delete category (checks product dependencies).

### Cart (`/cart`) [Protected]
- `GET /cart` — Get user's cart populated with live database prices and stock.
- `POST /cart/add` — Add item to cart with size variant.
- `POST /cart/sync` — Synchronize guest items into MongoDB cart upon login.
- `PUT /cart/items/:itemId` — Adjust item quantity.
- `DELETE /cart/items/:itemId` — Remove item from cart.
- `DELETE /cart/clear` — Empty cart.

### Orders (`/orders`)
- `POST /orders` — [Customer] Place order (server validates inventory, coupon, recalculates subtotal, shipping, and total).
- `GET /orders/my` — [Customer] Get user's order history.
- `GET /orders/:id` — [Customer/Admin] Get order details by ID or order number (ownership enforced).
- `POST /orders/:id/cancel-request` — [Customer] Request order cancellation with reason.
- `GET /orders/admin/all` — [Admin] List all orders with status/search filters.
- `PUT /orders/admin/:id/status` — [Admin] Transition order status lifecycle (pending -> confirmed -> processing -> shipped -> delivered, or cancelled with inventory restoration).
- `PUT /orders/admin/:id/tracking` — [Admin] Update tracking carrier and tracking number.
- `POST /orders/admin/:id/cancellation` — [Admin] Approve or reject cancellation request.

### Coupons (`/coupons`)
- `POST /coupons/validate` — Validate coupon eligibility, minimum order value, and first-order condition.
- `GET /coupons` — [Admin] List all coupons with usage stats.
- `GET /coupons/generate-code` — [Admin] Generate unique promo code.
- `POST /coupons` — [Admin] Create coupon (supports percentage, fixed, min order, and `isFirstOrderOnly`).
- `PUT /coupons/:id` — [Admin] Update coupon.
- `DELETE /coupons/:id` — [Admin] Delete coupon.

### Inventory (`/inventory`) [Admin]
- `GET /inventory/overview` — Get stock levels and low-stock alerts across variants.
- `POST /inventory/adjust/:productId` — Adjust variant stock (+/-) with reason audit log.
- `GET /inventory/logs` — View inventory movement audit trail.

### Dashboard & Analytics (`/dashboard`) [Admin]
- `GET /dashboard/stats` — Real-time revenue, order status breakdown, low-stock alerts, customer count, and sales trends.

### Settings & Media
- `GET /settings` / `PUT /settings` — Read and update store parameters (shipping fees, thresholds, contact info).
- `POST /uploads` — Upload product media via Multer (stored in `backend/uploads/`).
- `POST /contact` — Submit customer inquiries.
- `GET /health` — API liveness and uptime check.

---

## 🧪 Testing Report

Run the automated integration and security test suite:
```bash
node backend/test_workflows.js
```

### Verified Test Workflows:
1. **Admin Authentication**: Admin login, role verification, and JWT generation.
2. **Category Creation**: Created new chapter category in MongoDB.
3. **Product Management**: Created product with size inventory (S, M, L, XL), prices, and SKU.
4. **First-Order Coupon**: Created promo voucher with `isFirstOrderOnly: true`.
5. **Customer Registration**: Registered test user and generated authenticated session.
6. **Security (Guest Guard)**: Verified unauthenticated checkout rejected with HTTP 401.
7. **Security (Role Authorization)**: Verified customer accessing admin APIs rejected with HTTP 403.
8. **First-Order Eligibility**: Verified first-order discount allowed on user's initial purchase.
9. **Order Placement**: Validated server-side pricing, inventory decrements, and unique order number generation (`MK-...`).
10. **Inventory Decrement**: Confirmed variant stock correctly deducted in database.
11. **First-Order Reuse Prevention**: Confirmed second attempt to use first-order coupon rejected by backend.
12. **Cross-Customer Security**: Confirmed customer cannot read another customer's order (HTTP 403).
13. **Order Lifecycle Transition**: Admin transitioned order status (`pending` -> `confirmed` -> `shipped`) and assigned courier tracking number (`TCS Express`).
14. **Customer Live Tracking**: Customer verified updated status and tracking in their account.
15. **Dashboard Analytics**: Verified real MongoDB aggregations (total revenue, active orders, and status counts).