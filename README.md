# Shopfinity Backend 🛒

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A scalable **E-commerce backend API server** built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**. This backend powers the **Shopfinity** platform, enabling smooth user authentication, product management, order handling, and payment integration.

---


## 🚀 Features
- **Role-based Access Control**: Handles `admin`, `vendor`, and `user` roles with permission layers.
- **Product & Order Management**: Add, list, update products and track customer orders.
- **JWT Authentication**: Uses access and refresh tokens for secure login and session management.
- **SSLCommerz Payment Integration**: Handles transactions using Bangladesh’s popular payment gateway.
- **Email Notifications**: Automated emails with Nodemailer and SendGrid for confirmations and updates.
- **Schema Validation**: Validates requests using Zod for safe and structured data input.

---

## 🔗 Live API

Explore the live backend API here:  
[https://shipfinity-backend.vercel.app/](https://shipfinity-backend.vercel.app/)

---

## 💻 Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Bcrypt
- **Validation**: ZOD
- **Email**: Nodemailer, SendGrid
- **Payments**: SSLCommerz
- **Environment**: `.env` file for managing secrets/configs

---

## 🛠️ Quick Start

To get started with this project, follow the steps below:

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/shopfinity-backend.git
cd shopfinity-backend


### 2. Install Dependencies
Install the required packages using npm:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project and configure the following environment variables:


### Environment Variables Example

Create a `.env` file in the root folder and fill in your values as shown below:

```env
NODE_ENV=development          # Set to 'production' in production environment
PORT=5000                    # Port number where the server will run
DATABASE_URL=mongodb://localhost:27017/shopfinity-db  # MongoDB connection string
BCRYPT_SALT_ROUNDS=12        # Number of salt rounds for bcrypt password hashing
CLIENT_URL=https://yourfrontend.com  # Frontend application URL
JWT_ACCESS_SECRET=your_access_jwt_secret    # Secret key for signing access tokens
JWT_ACCESS_EXPIRES_IN=1h                   # Access token expiry time
JWT_REFRESH_SECRET=your_refresh_jwt_secret  # Secret key for signing refresh tokens
JWT_REFRESH_EXPIRES_IN=365                 # Refresh token expiry time (days)
SSL_STORE_ID=your_sslcommerz_store_id       # SSLCommerz payment store ID
SSL_STORE_PASSWORD=your_sslcommerz_password # SSLCommerz payment store password

### 4. Run the Development Server
Start the development server:
```bash
npm run dev
```
The server will be running at `http://localhost:5000`.

### 📜 Key Files:
- **`app.ts`**: Contains the main Express configuration, including middlewares and routes.
- **`server.ts`**: The entry point for starting the server.
- **`modules/`**: Contains all feature modules such as authentication, job applications, etc.
- **`utils/`**: Houses utility functions like JWT signing, email sending logic, etc.

## 🔒 Security
- **JWT Authentication**: Ensures secure access to protected routes and resources.
- **Bcrypt Password Hashing**: Protects user passwords by hashing them before storage.
- **Environment Variables**: Sensitive data like JWT secret and email credentials are stored securely.


## 📬 Contact
If you have any questions or suggestions, feel free to reach out at:
- **Email**: tanvir.dev3@gmail.com
- **Website**: [Tanvir](https://tanvir3.vercel.app/)

---
