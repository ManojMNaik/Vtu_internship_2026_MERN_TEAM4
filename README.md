# 🚀 ServiceMate

A modern **MERN-based service booking platform** that connects users with skilled technicians seamlessly.

---

## ✨ Overview

**ServiceMate** enables customers to discover technicians, book services, and manage jobs — all in one place.

It supports three core roles:

* 👤 **User** – Browse, book, review services
* 🛠️ **Technician** – Manage services, bookings, and portfolio
* 🛡️ **Admin** – Monitor and control platform activity

🔐 Authentication is powered by **JWT + OTP email verification** for secure access.

---

## 🧰 Tech Stack

### 🎨 Frontend

* ⚛️ React + Vite
* 🎯 Tailwind CSS
* 🧩 shadcn-style UI components
* 🔀 React Router DOM
* 🌐 Axios (with interceptors)
* 🎞️ Framer Motion
* 🔔 React Hot Toast / Sonner
* 🎨 Lucide React Icons
* 📋 React Hook Form + Zod
* 🌍 country-state-city

---

### ⚙️ Backend

* 🟢 Node.js + Express
* 🍃 MongoDB + Mongoose
* 🔑 JWT Authentication
* 🔐 bcryptjs (password hashing)
* 📧 Nodemailer + OTP Generator
* 📤 Multer + Cloudinary (file uploads)
* 📄 PDFKit (billing)

#### 🔒 Security Stack

* helmet
* cors
* xss-clean
* mongo-sanitize
* hpp
* express-rate-limit

#### ⚡ Performance & Logging

* morgan
* compression

---

## 🧩 Core Features

### 🔐 Authentication

* Signup/Login with roles
* OTP-based account verification
* JWT-protected routes
* Role-based access control

---

### 👤 User Module

* Search & filter technicians
* Book services with date/time
* Manage bookings
* Add/edit reviews

---

### 🛠️ Technician Module

* Profile management
* Service CRUD
* 📊 Unified workspace (`/technician`)
* Booking lifecycle handling
* Portfolio CRUD with image uploads

---

### 🛡️ Admin Module

* Platform monitoring dashboard
* User control (block/unblock)
* Booking & report oversight

---

### 📦 Booking & Billing

* Full booking lifecycle
* Status transitions
* Bill generation
* PDF export

---

### ⭐ Review System

* Ratings & comments
* Technician rating aggregation

---

## 📁 Project Structure

```bash
ServiceMate
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── templates
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs
├── README.md
└── SERVICEMATE_PROJECT_DETAILS.md
```

---

## 🌐 Frontend Routes

### Public

* `/`
* `/login`
* `/signup`
* `/verify-otp`

### User

* `/user/dashboard`
* `/bookings`
* `/bookings/new`

### Technician

* `/technician` (✨ Unified Workspace)
* `/technician/bookings`
* `/technician/services`
* `/technician/portfolio`

### Admin

* `/admin/dashboard`

---

## 💡 Key Highlights

* 🧠 Clean modular architecture
* ⚡ Fast Vite-powered frontend
* 🎯 Unified technician workspace for better UX
* ☁️ Cloudinary-powered media handling
* 🔐 Production-level security middleware

---

## 📌 Future Improvements (Suggested)

* 🔔 Real-time notifications (WebSockets)
* 💳 Online payments integration
* 📍 Map-based technician discovery
* 📊 Advanced analytics dashboard

---

## 🧑‍💻 Author

Built with focus on scalability, clean architecture, and premium UX.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
