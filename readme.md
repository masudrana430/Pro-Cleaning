# ProCleaning – Community Clean-Up & Issue Reporting Platform

ProCleaning is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that allows users to **report and track environmental / cleanliness issues** in their local area — such as garbage buildup, broken footpaths, illegal dumping, waterlogging, and more.

Citizens can:

- Submit detailed issue reports  
- Request or join clean-up drives  
- Contribute small amounts to support community services  
- View and manage their own issues and contributions in one place  

The project focuses on a **clean, modern UI** using Tailwind CSS, **secured routes** with Firebase Authentication, and a structured, real-world app architecture.

---

## 🔗 Live Demo

**Client Live URL:**  
👉 https://b12-a10-masud.netlify.app/

---

## ✨ Core Features

### 🧹 Issue Reporting & Tracking

- ✅ **Report Issues Easily** – Users can submit new clean-up issues with title, description, category, location, image URL, and estimated cost.
- 📂 **Issue Categories** – Predefined categories like Garbage, Illegal Construction, Broken Public Property, Road Damage, etc.
- 🔍 **Browse All Issues** – Visitors can explore all reported issues with filters and view detailed information (status, required amount, raised amount).
- 🧾 **Issue Details Page** – Each issue has its own detailed page with full description and contribution options.

### 👤 User Dashboards

- 👨‍💻 **My Issues Dashboard** – Logged-in users can see all issues they created, edit/update them, and track their progress.
- 💚 **My Contribution Page** – Users can view all their donations, including issue titles, categories, amounts, and dates.
- 🧾 **PDF Receipts & Reports**
  - Download **single contribution receipts** as PDF.
  - Export **full contribution history** as a detailed PDF report (powered by `jsPDF` + `jspdf-autotable`).

---

## 🔐 Authentication & Authorization (Firebase)

- **Firebase Authentication** with:
  - Email / Password sign-up and login
  - Google Sign-In
  - Update profile (display name & avatar) using `updateProfile()`
  - Forgot Password / Reset flow
- **Protected Routes**
  - Private routes restrict access to pages like *My Issues*, *My Contribution*, *Add Issues*, etc.
  - Unauthenticated users are redirected to Login and then back to their original target after successful login.

---

## 🖼️ UI, Animations & Micro-Interactions

- 🎨 **Responsive UI** built with **Tailwind CSS + daisyUI**
  - Modern, accessible components
  - Utility-first styling for fast iteration
- 🌗 **Dark / Light Theme Toggle**
  - Theme switcher for better viewing experience in different environments.
- 🎞️ **Lottie Animations**
  - Used across navbar links and sections for a friendly, interactive feel.
- ⌨️ **React Simple Typewriter**
  - Animated typewriter text (e.g., “Clean Drive”) in hero/CTA sections.
- ✨ **React Awesome Reveal**
  - Smooth scroll-in effects, fade/slide animations for sections and cards.
- 🌀 **Swiper (Hero Slider)**
  - Hero section with carousel/swiper for featured content (if enabled).
- 🔔 **Toasts & Alerts**
  - Friendly success/error toasts for actions like login/logout, form submission, etc.
  - SweetAlert2 or daisyUI modals/toasts can be used for confirmations (e.g., delete/update actions).

---

## 🧱 Tech Stack

### Frontend

- **React** (with Vite)
- **React Router** for SPA routing
- **Tailwind CSS** + **daisyUI** for styling
- **Lottie-react** for animations
- **react-simple-typewriter**
- **react-awesome-reveal**
- **Swiper** (for carousels / hero sliders)

### Backend

- **Node.js** + **Express.js**
- **MongoDB** (with a dedicated collection for issues and contributions)
- RESTful API endpoints for:
  - Creating and fetching issues
  - Creating and fetching contributions
  - Filtering logged-in user data (`/my-issues`, `/my-contribution`, etc.)

### Auth & Security

- **Firebase Authentication**
  - JWT handled on the client side for protecting routes & API calls
  - Only authorized users can perform sensitive actions (e.g., editing their own issues).

### Utilities

- **jsPDF** + **jspdf-autotable** – PDF receipts and reports
- **React Toast Notifications** (e.g., `react-toastify`)

---

## 🚀 Getting Started (Client)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/procleaning-client.git
   cd procleaning-client
