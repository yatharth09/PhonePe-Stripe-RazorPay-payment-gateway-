# Multi‑Provider Payment Gateway App (Stripe, PhonePe, Razorpay)

A **full‑stack payment gateway application** that integrates **Stripe**, **PhonePe**, and **Razorpay**.  
Users can make payments using multiple providers, and **order details are stored in MongoDB** via **Mongoose**.  
The backend is built with **Express**, and the frontend is built with **React**.

---

## 🚀 Features

- **Multiple Payment Options**
  - Pay via **Stripe**
  - Pay via **PhonePe**
  - Pay via **Razorpay**
- **Secure Transactions**
  - Server‑side verification of payment status
- **Order Management**
  - Store order and payment details in **MongoDB**
- **UI**
  - React‑based frontend
- **Scalable Backend**
  - RESTful APIs using **Express**
  - Mongoose model for orders 

---

## 🧱 Tech Stack

**Frontend**

- React
- Axios for API calls

**Backend**

- Node.js
- Express
- Mongoose (MongoDB ODM)
- Stripe SDK
- Razorpay SDK
- PhonePe integration (API/SDK as configured)

**Database**

- MongoDB (Atlas)

---

## 📁 Project Structure (Example)

```
├── Backend
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── models
│ │ ├── routes
│ └── app.js
└── Client
├── src
│ ├── assets
│ ├── pages
└── package.json
└── App.jsx
```

You can adjust this structure based on your implementation.

---

## ⚙️ Backend Setup

1. Go to the backend folder:

```
cd backend
```


2. Install dependencies:

```
npm install
```

3. Create an `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string

STRIPE_SECRET_KEY=your_stripe_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_BASE_URL=phonepe_api_base_url
```


4. Run the backend server:

```
npm run dev
or
npm start
```



## 🗄️ MongoDB Models 

**Order Model**

- `merchantOrderId` 
- `amount`
- `customerName`
- `mobileNumber` 
- `email` 
- `note`
- `status` 
- `type` 
- `lastWebhook` 
- `createdAt` 
- `updatedAt` 

You can extend this with more fields like items, metadata, etc.

---

## 💻 Frontend Setup

1. Go to the frontend folder:

```
cd frontend
```


2. Install dependencies:

```
npm i
```

3. Run the frontend app:
```
npm run dev
or
npm start
```


---

## 🧭 User Flow

1. On main page, user chooses a **payment method**:
- Stripe
- PhonePe
- Razorpay
3. Frontend calls backend API to **create an order**.
4. Backend:
- Creates order in MongoDB.
- Creates corresponding payment (Stripe Intent / Razorpay Order / PhonePe transaction).
- Returns required client secrets / order IDs / redirect URLs.
5. User completes payment via selected provider.
6. Provider sends **webhook / callback** to backend.
7. Backend verifies signature/status and updates **order status in MongoDB**.

---

## 🔐 Security Considerations

- All sensitive keys are stored in **environment variables**.
- Payment verification and signature checking done on the **server side**.
- No secret keys are exposed in the frontend.
- Webhook endpoints are protected via provider signatures.

---







