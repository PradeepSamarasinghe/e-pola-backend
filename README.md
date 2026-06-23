# e-pola
Sri Lanka's premier B2C grocery delivery platform. Seamlessly connecting customers to local vendors with real-time tracking, localized interfaces, and robust multi-vendor management.

# 🛒 e-pola

> **Fresh groceries delivered to your doorstep, anywhere in Sri Lanka.**
> A complete, end-to-end grocery delivery ecosystem featuring a React Native 
> mobile app for customers, a Next.js dashboard for vendors, and a powerful 
> Node.js backend.

![e-pola Banner](https://via.placeholder.com/1200x400/10B981/FFFFFF?text=e-pola+%E2%80%94+Fresh+Groceries,+Delivered+Fast)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-black)](https://expo.dev)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)](https://nodejs.org)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)](https://mongodb.com)
[![Made in Sri Lanka](https://img.shields.io/badge/Made%20in-%F0%9F%87%B1%F0%9F%87%B0%20Sri%20Lanka-orange)](#)

---

## 🎯 What Is e-pola?

e-pola is a comprehensive **B2C Grocery Delivery Platform** built specifically 
for the Sri Lankan market. 

While many grocery apps rely on generic white-label solutions that don't fit the 
local context, e-pola is engineered from the ground up to handle Sri Lankan logistics, 
multi-lingual requirements (English, Sinhala, Tamil), localized payment methods like 
Cash on Delivery (COD) and PayHere, and dynamic delivery zones.

**e-pola solves the grocery delivery gap.**

- 📱 **Native Mobile App** — Cross-platform iOS and Android app for customers
- 🏪 **Multi-Vendor System** — Support for multiple stores and regional hubs
- 💳 **Localized Payments** — Built-in Cash on Delivery and PayHere integration
- 📍 **Real-Time Tracking** — Third-party delivery status webhooks and live updates
- 🌍 **Fully Localized** — Seamless switching between English, Sinhala, and Tamil
- 📊 **Vendor Dashboard** — Next.js web portal for vendors to manage stock and orders

---

## ✨ Key Features

### For Customers (Expo Mobile App)
- **Multi-Lingual UI** — UI fully translated into Sinhala, Tamil, and English using `i18next`.
- **Advanced Product Search** — Filter products by category, price range, brand, and dietary tags.
- **Sri Lankan Address Formatting** — Structured address inputs (House No, Street, City, Postal Code) with geospatial coordinates.
- **Flexible Payments** — Cash on Delivery (COD) with confirmation flows, or secure online payments via PayHere.
- **Stock Locking** — 10-minute temporary stock reservation during checkout.
- **Order Tracking** — Live order status updates (Pending → Preparing → Out for Delivery) powered by Webhooks.

### For Vendors & Admins (Next.js Web App)
- **Store Management** — Update store details, operating hours, and location.
- **Inventory Control** — Track stock quantities, update prices, and handle product variants.
- **Order Fulfillment Queue** — View pending orders, process them, and assign them to delivery partners.

### For Developers (Node.js API)
- **Role-Based Access** — Secure JWT authentication with strict `customer`, `vendor`, and `admin` roles.
- **Geospatial Queries** — MongoDB `2dsphere` indexing to find nearest stores and calculate delivery fees.
- **Robust Webhooks** — endpoints to handle asynchronous payment confirmations and third-party logistics updates.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile App** | React Native (Expo) | Cross-platform customer application |
| **Vendor Web** | Next.js 14 + Tailwind CSS | Admin and vendor management dashboard |
| **Backend API** | Node.js + Express | Core business logic and REST endpoints |
| **Database** | MongoDB + Mongoose | Data persistence and geospatial indexing |
| **Payments** | PayHere API | Secure local payment gateway |
| **Localization** | i18next + expo-localization | Sinhala, Tamil, and English translations |
| **Crash Reporting**| Sentry (@sentry/react-native)| Real-time production error tracking |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Expo CLI
- PayHere Sandbox Account (for payment testing)

### 1. Setup Backend
```bash
git clone https://github.com/PradeepSamarasinghe/e-pola-backend.git
cd e-pola-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# (Ensure MONGO_URI, JWT_SECRET, and PAYHERE_SECRET are set)

# Start the development server
npm run dev
```

### 2. Setup Customer App (Expo)
```bash
cd e-pola

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### 3. Setup Vendor Web Dashboard
```bash
cd e-pola-vendor-web

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

---

## 📁 Project Structure
```text
e-pola-ecosystem/
├── e-pola/                       # React Native (Expo) Customer App
│   ├── app/                      # Expo Router screens
│   │   ├── (tabs)/               # Bottom tab navigation
│   │   ├── auth/                 # OTP Login & Phone verification
│   │   ├── checkout.tsx          # Localized checkout flow
│   │   └── policies/             # Static Trust & Compliance screens
│   ├── lib/
│   │   └── i18n/                 # Translation dictionaries (en, si, ta)
│   └── context/                  # Auth, Cart, and Wishlist state
│
├── e-pola-backend/               # Node.js + Express API
│   ├── src/
│   │   ├── controllers/          # Business logic (Orders, Auth, Payments)
│   │   ├── models/               # Mongoose schemas (User, Product, Order)
│   │   ├── routes/               # Express route definitions
│   │   └── middleware/           # JWT & Role-based access control
│   └── server.js                 # API entry point
│
└── e-pola-vendor-web/            # Next.js Vendor Dashboard
    ├── src/app/                  # Next.js App Router
    └── tailwind.config.ts        # Styling configuration
```

---

## 🗺️ Roadmap

### Phase 1 — Payments (Completed)
- [x] PayHere integration (MD5 Hash generation & Webhooks)
- [x] Cash on Delivery (COD) as a first-class payment type
- [x] 10-minute stock lock on checkout
- [x] Standardized LKR currency handling

### Phase 2 — Delivery Logistics (Completed)
- [x] Third-party delivery tracking integration
- [x] Distance-based delivery fee calculation
- [x] Webhook listeners for driver status updates

### Phase 3 — Localization (Completed)
- [x] `i18next` configuration for English, Sinhala, Tamil
- [x] Sri Lankan structured address formats
- [x] Strict `+94` phone number validation

### Phase 4 — Trust & Compliance (Completed)
- [x] Privacy Policy, Terms of Service, and Refund Policy screens
- [x] Explicit consent requirements at signup
- [x] Sentry crash reporting integration

### Phase 5 — Remaining Commerce Features (In Progress)
- [ ] Order Tracking & Order History screens
- [ ] Promo code discount system
- [ ] Product ratings and reviews
- [ ] "Reorder previous cart" functionality

### Phase 6 — Admin Dashboard
- [ ] Stock management UI
- [ ] Low-stock alerts
- [ ] Order fulfillment queue

---

## 🙏 Acknowledgements

- **PayHere** — For providing a seamless local payment gateway
- **Expo & React Native** — For the incredible cross-platform mobile developer experience
- **Every Sri Lankan Consumer** — This is built to make your daily life easier 🇱🇰

---

## 📞 Contact

**Project Maintainer:** [@PradeepSamarasinghe](https://github.com/PradeepSamarasinghe)

**Email:** samarasinghepradeep242@gmail.com

---

<div align="center">

**Built with ❤️ in Sri Lanka 🇱🇰**
</div>
