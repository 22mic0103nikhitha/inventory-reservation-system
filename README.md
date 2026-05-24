# Inventory Reservation System

A full-stack inventory reservation platform built using Next.js, Prisma, PostgreSQL (Supabase), and TypeScript.

## Problem Statement

When customers proceed to checkout, payment may take several minutes (UPI, cards, wallets, 3DS verification, etc.).

If inventory is deducted only after payment succeeds:

- Multiple users may pay for the same product.
- Overselling occurs.
- Refunds and operational issues increase.

If inventory is deducted when a product is added to the cart:

- Inventory appears unavailable.
- Abandoned carts reduce sales.

To solve this, the system implements **temporary inventory reservations**.

A reservation holds stock for a limited period. If payment succeeds, the reservation is confirmed. If payment fails or expires, the stock is released back to inventory.

---

# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js API Routes
- Prisma ORM

## Database

- PostgreSQL (Supabase)

## Deployment

- Vercel

---

# Features

## Product Listing

Displays:

- Product Name
- Description
- Warehouse
- Available Stock

Example:

```text
iPhone 15
Warehouse: Chennai
Available Stock: 10
```

---

## Inventory Tracking

Each warehouse maintains:

```text
totalStock
reservedStock
availableStock
```

Formula:

```text
availableStock = totalStock - reservedStock
```

---

## Reservation System

Users can reserve a product.

A reservation contains:

```text
Reservation ID
Product
Warehouse
Quantity
Status
Expiry Time
```

Reservation Status:

```text
PENDING
CONFIRMED
RELEASED
```

---

## Reservation Confirmation

When payment succeeds:

```text
PENDING → CONFIRMED
```

Reserved inventory becomes permanently allocated.

---

## Reservation Release

When payment fails or user cancels:

```text
PENDING → RELEASED
```

Reserved inventory is returned to available stock.

---

# Database Schema

## Product

| Field | Type |
|---------|---------|
| id | UUID |
| name | String |
| description | String |

---

## Warehouse

| Field | Type |
|---------|---------|
| id | UUID |
| name | String |

---

## Inventory

| Field | Type |
|---------|---------|
| id | UUID |
| productId | UUID |
| warehouseId | UUID |
| totalStock | Int |
| reservedStock | Int |

---

## Reservation

| Field | Type |
|---------|---------|
| id | UUID |
| productId | UUID |
| warehouseId | UUID |
| quantity | Int |
| status | Enum |
| expiresAt | DateTime |

---

# API Endpoints

## Get Products

```http
GET /api/products
```

Returns products with warehouse inventory.

---

## Get Warehouses

```http
GET /api/warehouses
```

Returns all warehouses.

---

## Create Reservation

```http
POST /api/reservations
```

Request:

```json
{
  "productId": "...",
  "warehouseId": "...",
  "quantity": 1
}
```

Response:

```json
{
  "id": "...",
  "status": "PENDING"
}
```

---

## Confirm Reservation

```http
POST /api/reservations/:id/confirm
```

Updates:

```text
PENDING → CONFIRMED
```

---

## Release Reservation

```http
POST /api/reservations/:id/release
```

Updates:

```text
PENDING → RELEASED
```

and restores stock.

---

# Concurrency Handling

The reservation endpoint is designed to prevent overselling.

Inventory availability is validated before reservation creation.

Logic:

```text
availableStock =
totalStock - reservedStock
```

If requested quantity exceeds available stock:

```http
409 Conflict
```

is returned.

This ensures inventory cannot be reserved beyond available stock.

---

# Error Handling

## Out of Stock

```http
409 Conflict
```

Response:

```json
{
  "error": "Not enough stock available"
}
```

---

## Expired Reservation

```http
410 Gone
```

Response:

```json
{
  "error": "Reservation expired"
}
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd inventory-reservation-system
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create:

```env
.env
```

Add:

```env
DATABASE_URL="your_supabase_connection_string"
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migrations

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# Sample Data

Products:

```text
iPhone 15
MacBook Air M3
Samsung S25
```

Warehouses:

```text
Chennai
Bangalore
Hyderabad
```

Inventory:

```text
iPhone 15 → Chennai → 10

MacBook Air M3 → Bangalore → 5

Samsung S25 → Hyderabad → 8
```

---

# Future Improvements

- Redis distributed locking
- Idempotency keys
- Background workers
- Reservation countdown timer
- Reservation expiry automation
- Audit logging
- Multi-warehouse allocation
- Payment gateway integration

---

# Deployment

Frontend:

- Vercel

Database:

- Supabase PostgreSQL

---

# Author

Y Sai Sree Nikhitha
