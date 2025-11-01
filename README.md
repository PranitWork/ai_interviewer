# 🎙️ AI Voice Interview SaaS Platform (MERN)

## 🚀 Overview

This project is a **SaaS-based AI Interview Platform** that allows users to practice interviews through AI.  
It generates **questions**, evaluates **answers**, and provides **AI feedback reports**.  
Users can **upgrade their plans** for more features, and admins can monitor platform analytics.

---

## 🧠 End Goal

Build a **production-ready AI Interview SaaS** with:
- User authentication (Email, Google)
- AI-generated interviews and evaluations
- Feedback reports powered by OpenAI
- Subscription-based plans (Free / Pro / Enterprise)
- Usage tracking and plan restrictions
- Admin dashboard for analytics and user control

---

## 🏗️ Tech Stack

**Backend:**
- Node.js + Express.js  
- MongoDB + Mongoose  
- OpenAI API (for AI questions & evaluations)  
- Stripe / Razorpay (for payments)  
- JWT Authentication  
- Nodemailer (for emails)

**Frontend (planned):**
- React + Redux (or Next.js)
- TailwindCSS + ShadCN UI (recommended)

---

## 📦 Folder Structure

# ⚙️ API Endpoints Documentation

## 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login with email and password |
| `POST` | `/google-login` | Login with Google OAuth |
| `POST` | `/forgot-password` | Send password reset email |
| `PUT` | `/reset-password/:token` | Reset password using token |
| `GET` | `/logout` | Logout user and clear JWT |

---

## 🧑‍💼 Interview Routes (`/api/interview`)

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `POST` | `/start` | Generate AI interview questions |
| `POST` | `/evaluate` | Evaluate user answers (AI feedback) |
| `GET` | `/all` | Get all interviews for the logged-in user |
| `GET` | `/:id` | Get single interview details |
| `DELETE` | `/:id` | Delete an interview |

---

## 🧾 Feedback Routes (`/api/feedback`)

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `POST` | `/generate` | Generate detailed AI feedback report |
| `GET` | `/all` | Fetch all user feedback reports |
| `GET` | `/:interviewId` | Get feedback by interview ID |

---

## 💳 Subscription Routes (`/api/subscription`)

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `POST` | `/create` | Create checkout session (Stripe/Razorpay) |
| `POST` | `/webhook` | Handle payment webhook events |
| `GET` | `/status` | Get user’s current plan and expiry |
| `PUT` | `/cancel` | Cancel user’s subscription |

---

## 📈 Analytics Routes

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `GET` | `/api/user/analytics` | Get user analytics (usage, reports, etc.) |
| `GET` | `/api/admin/analytics` | Platform analytics for admin |

---

## 🧰 Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|---------|-----------|--------------|
| `GET` | `/users` | Fetch all users |
| `GET` | `/interviews` | Fetch all interviews |
| `PUT` | `/user/:id/plan` | Manually update a user’s plan |
| `DELETE` | `/user/:id` | Delete a user |

---

## 🔐 Middleware

| Middleware | Description |
|-------------|-------------|
| `protect` | Protects routes using JWT token |
| `checkPlanLimits` | Prevents usage beyond free plan limits |
| `isAdmin` | Restricts routes to admin users only |
| `trackUsage` | Tracks interview and feedback usage |

---

## 🧩 Utilities

| Utility File | Purpose |
|---------------|----------|
| `openaiClient.js` | Configures and handles OpenAI API calls |
| `email.js` | Manages all email templates and sending logic |
| `paymentService.js` | Handles Stripe/Razorpay API integrations |
| `planUtils.js` | Validates plan usage and limits |
| `voiceService.js` | (Optional) Speech-to-text and tone analysis |

---

## 🧭 System Flow

1. **User registers or logs in**
2. **Starts an AI interview** — platform generates random technical questions
3. **User answers (text or voice)** — AI evaluates and gives a feedback score
4. **Feedback report generated** — summary of performance and suggestions
5. **Usage tracked** — if free plan limit reached → prompt upgrade
6. **Payment handled** — Stripe/Razorpay integration for plan upgrade
7. **Admin dashboard** — manage users, plans, analytics

---

## 💡 SaaS Features Summary

| Feature | Description |
|----------|--------------|
| 🔐 Auth | Secure login (email + Google) |
| 🧠 AI Interview | GPT-powered question generation |
| 🗣️ Voice Support | Voice input and evaluation (optional) |
| 📊 Feedback | AI-powered performance reports |
| 💳 Subscription | Stripe/Razorpay integrated plans |
| 🚦 Plan Limits | Restrict free users’ access |
| 🧾 Analytics | Stats for both users & admins |
| 🧑‍💼 Admin Panel | Full user & data control |

---

## 🧱 Future Enhancements

- 📋 Resume-based interview generation  
- 🎙️ Real-time voice tone & confidence analysis  
- 🧠 Skill-level tracking & learning suggestions  
- 🏢 Company (team-based) accounts  
- 🔗 Public API for external integrations  
- 📉 AI learning curve tracking  

---
